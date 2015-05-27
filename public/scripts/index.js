/*
 * Loads page data */

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
    fs = new forceChart(JSON.parse(data));
  });

}
$(function() {
  $('.itsa-button').click(function() {
    $(this).removeClass('itsa-button');
    letsGo();
  });
  $('.big-box').on('keyup', function() {
    var t = $(this).val();
    if (!t.match("^https?://")) {
      console.log('nogood');
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


//TEST
$(function() {
  $('.big-box').val('http://www.google.com');
  letsGo();
})