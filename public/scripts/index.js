/*
 * Loads page data */
var fs;

function startSpin() {
  $('#playbutton').addClass('fa-counter-spin');
  $('#starbutton').addClass('fa-spin');
}
function stopSpin() {
  $('#playbutton').removeClass('fa-counter-spin');
  $('#starbutton').removeClass('fa-spin');
}
function hideButton() {
  $('#start-button').hide();
}
function showControls() {
  $('#controls').show();
}
function letsGo() {
  startSpin();
  var bb = $('.big-box');
  bb.attr('disabled', 'true');
  var page_url = bb.val();
  var ld = new linkData(page_url);
  document.title = ld.host + ": Crawl data";
  $.post('/fetch', {url: page_url}, function(data) {
    stopSpin();
    hideButton();
    showControls();
    fs = new ForceChart(JSON.parse(data));
  });

}
$(function() {
  //Setup events

  //go button event
  $('.itsa-button').click(function() {
    $(this).removeClass('itsa-button');
    letsGo();
  });

  //controls click event
  $('#controls').click(playOrPause);

  //input validation
  $('.big-box').on('keyup', function() {
    var t = $(this).val();
    if (!t.match("^https?://")) {
      $(this).addClass('bad');
    } else {
      $(this).removeClass('bad');
    }
  });

});

function linkData(url) {
  this.anchor = document.createElement('a');
  this.anchor.href = url;
  this.scheme = this.anchor.protocol;
  this.host = this.anchor.host;
  this.path = this.anchor.pathname + this.anchor.search + this.anchor.hash;
}

function playOrPause() {
  if (fs.status == 'play') {
    pause();
  } else {
    play();
  }
}
function play() {
  var controls = $('#controls');
  var icon = controls.find('i');
  controls.addClass('pause');
  controls.removeClass('play');
  icon.addClass('fa-pause');
  icon.removeClass('fa-play');
  fs.play();
}
function pause() {
  var controls = $('#controls');
  var icon = controls.find('i');
  controls.removeClass('pause');
  controls.addClass('play');
  icon.removeClass('fa-pause');
  icon.addClass('fa-play');
  fs.pause();
}

//TEST
//$(function() {
//  $('.big-box').val('http://www.google.com');
//  letsGo();
//})