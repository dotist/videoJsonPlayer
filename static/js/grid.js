/**
 * @file grid.js
 */

var winSize = {
  'w' : window.innerWidth, 'h' : window.innerHeight
};
var direction = (winSize.w < winSize.h) ? 'horizontal' : 'vertical';
var baseSide = (winSize.w > winSize.h) ? winSize.w : winSize.h;
var gridClassActive = 'grid-segment__border-active';
var g = gridData();

/**
  * Grid data.
  */
function gridData() {
  return {
    'dev' : true,
    'id' : 'grid-wrapper',
    'steps': 21,
    'segments': 3,
    'sideSteps': 10
  };
}

/**
 * Random border color
 */
function borderColor() {
  var array = [
    'blue', 'orange', 'grey'
  ];
  return array[Math.floor(Math.random()* array.length)];
}

/**
 * Toggle grid view
 */
function toggleGridDisplay($grid, toggle = false, color) {
  var delay = 45;
  if (toggle == false) {
    $grid.children().each(function(i){
      var el = $(this);
      setTimeout(function() {
        el.removeClass(gridClassActive);
      }, i * delay);
    });
  } else {

    $($grid.children().get().reverse()).each(function(i){
      var $el = $(this);
      setTimeout(function() {
        $el.addClass(gridClassActive);
        $el.css({
          'border': '1px solid ' + color
        });
        $el.find('line').attr('stroke', color);
      }, i * delay);
    });
  }
}

/**
 *
 */
function gridInitWrapper($) {
  var grid = document.getElementById(g.id);
  var $wrapper;
  if (grid == null) {
    $('body').append('<div></div>');
    $wrapper = $('body').children().last();
    $wrapper.attr('id', g.id);
  }
  else
    $wrapper = $(grid);
  if (g.dev == true) {
    $wrapper.addClass('dev');
  }

  return $wrapper;
}

function gridDrawSides($wrapper) {
  var $first = $wrapper.children().first();
  var $last = $wrapper.children().last();
  var w = ($first.outerWidth() / 2) - ($last.outerWidth() / 2);
  var h = ($first.outerHeight() / 2) - ($last.outerHeight() / 2);

  var sides = gridSidesData(w, h, $first, $last);

  $.each(sides, function(i, e){
    $wrapper.prepend('<div></div>');
    var $el = $wrapper.children().first();
    var id = i;
    $el.attr('id', id)
      .attr('s', 0)
      .addClass('grid-side');
    var draw = SVG(id);

    // draw.line(e.svgLine);
    var l1; var l2;
    if (e.dir == 'x') {
      l1 = $last.outerWidth();
      l2 = $first.outerWidth();
    }
    else {
      l1 = $last.outerHeight();
      l2 = $first.outerHeight();
    }
    l1 = l1 / g.sideSteps
    l2 = l2 / g.sideSteps
    for (var j = 0; j <= g.sideSteps; j++) {
      var lineData = [];
      var l1x = l1 * j;
      var l2x = l2 * j;
      if (e.dir == 'x') {
        lineData = [
          e.svgLine[0] + l1x, e.svgLine[1], e.svgLine[2] + l2x, e.svgLine[3]
        ];
      }
      else if (e.dir == 'y') {
        lineData = [
          e.svgLine[0], e.svgLine[1] + l1x, e.svgLine[2], e.svgLine[3] + l2x
        ];
      }

      draw.line(lineData);

    }
  });
}

function gridSidesData(w, h, $first, $last) {
  return {
    'top': {
      'dir': 'x',
      'svgLine': [
        w, h, $first.position().left, $first.position().top
      ],
    },
    'right': {
      'dir': 'y',
      'svgLine': [
        w + $last.outerWidth(), h, $first.outerWidth(), $first.position().top
      ],
    },
    'bottom': {
      'dir': 'x',
      'svgLine': [
        w, h + $last.outerHeight(), $first.position().left, $first.outerHeight()
      ],
    },
    'left': {
      'dir': 'y',
      'svgLine': [
        w, h, $first.position().left, $first.position().top
      ],
    },
  };
}

$(document).ready(function(){

  /**
   * Init Grid
   */
  function initGrid() {

    // Wrapper
    var $wrapper = gridInitWrapper($);
    $wrapper.css({
      'height': baseSide,
      'width': baseSide,
    });

    // insertDiv segments
    var steps = g.steps;
    var segments = g.segments;
    var percentageStep = ((100) / steps) / 100;
    var scale = 1;
    var insertDiv = '<div></div>';
    var l = baseSide;
    var offset = 0;
    var segMax = Math.round(steps / segments);
    var curSeg = 1;
    for (var i = 0; i < steps; i++) {
      // Check and update segment.
      if (i >= segMax) {
        segMax = segMax + Math.round(steps / segments);
        curSeg++;
      }
      $wrapper.append(insertDiv);
      var $el = $wrapper.children().last();
      $el.attr('id', 'grid-' + i)
        .attr('i', i)
        .attr('segment', curSeg)
        .addClass('grid-segment');
      var css = {
        'width' : l,
        'height' : l,
        'left' : offset,
        'top' : offset,
      };
      $el.css(css);
      // Update magnification.
      var n = l - (l * percentageStep) * 2;
      offset += (l - n) / 2;
      l = n;



      // if u want to use scale.
      // scale -= percentageStep;
      // 'transform': 'scale(' + scale + ')'
    }
    // Corners.
    gridDrawSides($wrapper);

    /**
     * Offset centering
     */
    var offsetDir = direction == 'horizontal' ? 'left' : 'top';
    var offsetSideLength = direction == 'horizontal' ? winSize.w : winSize.h;
    var offset = ((offsetSideLength - baseSide) / 2) + 'px';
    var css = {};
    css[offsetDir] = offset;
    $wrapper.css(css);

    /**
     * Offset Scaling
     */
    var offsetScaling = 1.13;
    var offsetTranslate = winSize.h * -0.1;
    $wrapper.css({
      'transform': 'translate(0, ' + offsetTranslate + 'px)'
      // 'transform': 'scale(' + offsetScaling + ') translate(0, -70px)'
    });

    // Animate grid
    var $gridCtrl = $('#grid-ctrl form #gridIo');
    $gridCtrl.click(function(){
      var toggle = $(this).prop('checked');
      console.log(toggle);
      toggleGridDisplay($wrapper, toggle, borderColor());
    });
    if (g.dev == true) {
      $gridCtrl.prop('checked', true);
      toggleGridDisplay($wrapper, true, borderColor());
    }

  }



  /**
   *
   */


  initGrid();


  // Screen
  var mq = window.matchMedia( "(min-width: 800px)" );
  if (mq.matches) {

  } else {
    console.log('not big enuf');
    // window width is less than 500px
  }
});