function ForceChart(start_data) {

  var self = this;

  self.width = 960;
  self.height = 500;

  self.node_data = {};
  self.node_data[start_data.url] = start_data;

  self.force = d3.layout.force()
    .size([self.width, self.height])
    .nodes([
      //{url: start_data.url}
      start_data
    ]) // initialize with a single node
    .linkDistance(30)
    .charge(-60)
    .on("tick", tick);

  self.svg = d3.select("body").append("svg")
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

  function mousedown() {
    var point = d3.mouse(this),
      node = {x: point[0], y: point[1]},
      n = self.nodes.push(node);

    // add links to any nearby nodes
    self.nodes.forEach(function (target) {
      var x = target.x - node.x,
        y = target.y - node.y;
      if (Math.sqrt(x * x + y * y) < 30) {
        self.links.push({source: node, target: target});
      }
    });

    self.restart();
  }

  function tick() {
    self.link.attr("x1", function (d) {
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
      return d.bytes / 1024;
    })
    .on('mouseover', function(d) {
      $('#current-url').text(d.url);
    })
    .on('mouseout', function(d) {
      $('#current-url').text('');
    })
    .call(self.force.drag);

  self.force.start();
};
ForceChart.prototype.addNode = function(page_data, link_to) {
  var self = this;
  if (self.node_data.hasOwnProperty(page_data.url)) {
    return;
  }
  if (!self.node_data.hasOwnProperty(link_to)) {
    return;
  }
  var link_target_node = self.node_data[link_to];
  page_data.x = link_target_node.x;
  page_data.y = link_target_node.y;
  self.nodes.push(page_data);
  self.links.push({source: page_data, target: link_target_node});

}