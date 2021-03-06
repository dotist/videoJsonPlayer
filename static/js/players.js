function initPlayer(vid) {
  var options = {
    id: vid,
    loop: false,
    // autoplay: true,
    width: 640,
    height: 480
  };
  var player = new Vimeo.Player(vid, options);
  return player;
}

/**
 * Scene elements - thumbnails & videos.
 */
$(document).ready(function () {

  var wrapper = 'master-video-player-inner';
  var $wr = $('#' + wrapper);
  var players = [];

  initPlayers($wr);
  // initPlayers(d.e, $wr);

  var players = [];
  $('body').imagesLoaded(function () {
    initTriggers(players);
  });

  /**
   * Playlist nav
   */
  // $('#playlist').children().click(function () {
  //   var parId = ($('.video-player.active').attr('parent'));
  //   var parIndex = $('#' + parId).index();
  //   var index = parIndex + parseInt($(this).attr('val'));
  //   var activePlayerId = $('.video-player.active').attr('id');
  //   players[activePlayerId].pause();
  //   $('.scene-element').eq(index).click();
  // });

  /**
   *
   */
  function initTriggers(players) {
    $('.scene-element').each(function (i, e) {
      var $trigger = $(this);
      $trigger.click(function () {
        var activeLang = $('.lang-link.active-link').children().attr('lang');
        var vid = activeLang == 'en-GB' ? $trigger.attr('viden') : $trigger.attr('vidde');
        var player = initPlayer(vid);
        player.on('ended', function (data) {
          closeVideoPlayer();
        });
        $('body').addClass('video-player-active');
        $('#master-video-player').addClass('active');
        $.each(players, function (i, e) {
          $('#' + i).removeClass('active');
        });
        $('#' + vid).addClass('active');
        // play
        player.pause();
        players.activePlayer = player;
      });
    });
  }

  /**
   * Close video player.
   */
  function closeVideoPlayer() {
    setTimeout(function () {
      var $activePlayer = $('.video-player.active');
      // var activePlayerId = $('.video-player.active').attr('id');
      players.activePlayer.pause();
      $('#master-video-player').removeClass('active');
      $('body').removeClass('video-player-active');
      var delay = 500;
      function removeStopped($el) {
        setTimeout(function () {
          $el.remove();
        }, delay);
      }
      var $parent = $('#' + $activePlayer.attr('parent'));
      setTimeout(function () {
        $('#' + $activePlayer.attr('parent')).addClass('fadeOut');
        if ($parent.hasClass('image')) {
          removeStopped($('#' + $activePlayer.attr('parent')));
        }
        $activePlayer.removeClass('active');
      }, delay);

    }, 500);
  }

  $('.video-controls .close, #master-video-player').click(function () {
    closeVideoPlayer();
  });

  $(document).keyup(function (e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
      closeVideoPlayer();
    }
  });


  // Controller jquery.
  $('#master-video-player').hover(function () {
    $(this).toggleClass('hover');
  }, function () {
    $(this).toggleClass('hover');
  });
});

/**
 * Init videos in both languages.
 */
function initPlayers($wr) {
  $.each($('.scene-element'), function () {
    var $parent = $(this);
    var vid = $parent.attr('viden');
    $wr.prepend('<div class="video-player"></div>');
    var $el = $wr.children().first();
    $el.attr('id', vid);
    $el.attr('id', vid).attr('parent', $parent.attr('id')).attr('lang', 'en');
    var vid = $parent.attr('vidde');
    $wr.prepend('<div class="video-player"></div>');
    var $el = $wr.children().first();
    $el.attr('id', vid).attr('parent', $parent.attr('id')).attr('lang', 'de');
  });
}
