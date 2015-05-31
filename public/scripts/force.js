function ForceChart(start_data) {

  var self = this;

  self.max_depth = 3;
  self.current_depth = 0;
  self.node_queue = [];

  self.status = 'play';

  self.width = 960;
  self.height = 500;
  self.larget_page = 0;
  self.smallest_page = 0;

  self.node_data = {};


  self.force = d3.layout.force()
    .size([self.width, self.height])
    .nodes([
      //{url: start_data.url}
      start_data
    ]) // initialize with a single node
    .linkDistance(75)
    .charge(-160)
    .on("tick", tick);

  self.svg = d3.select("#chart")
    .attr("width", self.width)
    .attr("height", self.height);

  self.svg.append("rect")
    .attr("width", self.width)
    .attr("height", self.height);

  self.nodes = self.force.nodes(),
    self.links = self.force.links(),
    self.node = self.svg.selectAll(".node"),
    self.link = self.svg.selectAll(".link");

  self.cursor = self.svg.append("circle")
    .attr("r", 30)
    .attr("transform", "translate(-100,-100)")
    .attr("class", "cursor");

  self.restart();
  self.warmUpSpider(start_data);
  self.processQueue();

  function tick() {
    self.link.attr("x1", function (d) {
      if (d.source.x == NaN) {
        console.log("It's gone wack");
        return 250;
      }
      return d.source.x;
    })
    .attr("y1", function (d) {
      return d.source.y;
    })
    .attr("x2", function (d) {
      return d.target.x;
    })
    .attr("y2", function (d) {
      return d.target.y;
    });

    self.node.attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    });
  }
}

ForceChart.prototype.restart = function() {
  var self = this;
  self.link = self.link.data(self.links);

  self.link.enter().insert("line", ".node")
    .attr("class", "link");

  self.node = self.node.data(self.nodes);

  self.node.enter().insert("circle", ".cursor")
    .attr("class", "node")
    .attr("r", function(d) {
      //1 pixel for every KB
      return self.getNodeSize(d);
    })
    .on('mouseover', function(d) {
      showData(d);
    })
    .on('mouseout', function(d) {
      hideData();
    })
    .call(self.force.drag);

  self.force.start();
};

ForceChart.prototype.warmUpSpider = function(start_data) {
  this.node_data[start_data.url] = start_data;
  this.spider(start_data);

};
ForceChart.prototype.processQueue = function() {
  var self = this;
  if (self.status == 'play') {
    var queued_item = self.node_queue.shift();
    if (queued_item) {
      self.addNode(queued_item.data, queued_item.link_to);
    }
  }
  setTimeout(function() {
    self.processQueue();
  }, 100);
}
/*
 * This is only called from addNode or warmUpSpider.  A node has just been added to the chart.
 * Process the links.
 */
ForceChart.prototype.spider = function(page_data) {
  var self = this;

  /*
   * For each of the links, either create a link to an existing node or create a new node (with link).
   */
  for (var i = 0; i < page_data.links.length; i++) {
    var urldx = page_data.links[i];

    console.log("Making link for " + urldx);

    if (self.hasKnownUrl(urldx)) {
      //The url page_data links to is already in the graph, so just add a link and move on.
      //self.links.push({source: page_data, target: self.node_data[urldx]});
      continue;
    }

    self.node_data[urldx] = 'fetching';
    console.log("Adding node for " + urldx);

    $.post('/fetch', {url: urldx}, function(data) {
      var postResponse = JSON.parse(data);
      console.log("Got response for " + urldx);
      self.node_queue.push({data: postResponse, link_to: page_data.url});
      //self.addNode(postResponse, page_data.url);
    });

  }

};

ForceChart.prototype.hasKnownUrl = function(url) {
  return this.node_data.hasOwnProperty(url);
};

ForceChart.prototype.addNode = function(page_data, link_to) {
  var self = this;

  /* recursion terminating condition */
  if (self.hasKnownUrl(page_data.url) && self.node_data[page_data.url] != 'fetching') {
    return;
  }
  self.node_data[page_data.url] = page_data;

  /* sanity check */
  if (!self.hasKnownUrl(link_to)) {
    return;
  }

  /* create node on the visualization */
  var link_target_node = self.node_data[link_to];
  page_data.x = link_target_node.x;
  page_data.y = link_target_node.y;
  self.nodes.push(page_data);
  self.links.push({source: page_data, target: link_target_node});
  self.restart();

  /* spider into our new node */
  if (self.current_depth < self.max_depth) {
    self.current_depth++;
    self.spider(page_data);  
  }
  
};

ForceChart.prototype.getNodeSize = function(page_data) {
  var b = page_data.bytes;
  var smallest = 5;
  var largest = 25;
  var s = b / (5*1024);
  return Math.max(smallest, Math.min(largest, s));

};
ForceChart.prototype.play = function() {
  var self = this;
  self.status = 'play';
}
ForceChart.prototype.pause = function() {
  var self = this;
  self.status = 'pause';
}

function showData(d) {
  $('#current-url').text(d.url);
  $('#css-count').text(d.stylesheets.length);
  $('#img-count').text(d.imgs.length);
  $('#script-count').text(d.scripts.length);
  $('#page-size').text(d.bytes);
  $('#page-details').css('display', 'inline-block');
}
function hideData() {
  $('#current-url').text('');
  $('#page-details').hide();
}