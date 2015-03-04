'use strict';

window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

// (function(){
  //  canvas
  var canvas,
      context,
      canvasWidth,
      canvasHeight,
      previewCanvas,
      previewContext,
      current_pencil,
      saved_pencils         = [],
  //  debug
      log_recorded_actions  = false,
      log_undo_actions      = false,
      log_history           = false;

  function init () {
    console.log('init');

    canvas = document.getElementById('sketch');
    canvasWidth  = canvas.offsetWidth;
    canvasHeight = canvas.offsetHeight;

    console.log(canvasHeight, canvasWidth);

    // check for canvas
    if (canvas && canvas.getContext) {
      // set up canvas
      context = canvas.getContext('2d');
      context.lineJoin = 'round';
      context.lineCap = 'round';
      context.fillStyle = 'rgb( 255, 255, 255)';
      context.fillRect( 0, 0, canvas.width, canvas.height);
    }

    // preview setup
    previewCanvas = document.getElementById('preview_sketch');
    // check for canvas
    if (previewCanvas && previewCanvas.getContext) {
      // set up canvas
      previewContext = previewCanvas.getContext('2d');
      previewContext.lineJoin = 'round';
      previewContext.lineCap = 'round';
    }

    canvas.addEventListener('mousedown', ev_canvas, false);
    canvas.addEventListener('mousemove', ev_canvas, false);
    canvas.addEventListener('mouseup',   ev_canvas, false);

  }

  // Trig lib (needed for brush rotation)
  // https://github.com/triceam/HTML5-Canvas-Brush-Sketch/blob/master/src/js/trigonometry.js
  var Trig = {
    distanceBetween2Points: function ( point1, point2 ) {

      var dx = point2.x - point1.x;
      var dy = point2.y - point1.y;
      return Math.sqrt( Math.pow( dx, 2 ) + Math.pow( dy, 2 ) );  
    },

    angleBetween2Points: function ( point1, point2 ) {

      var dx = point2.x - point1.x;
      var dy = point2.y - point1.y; 
      return Math.atan2( dx, dy );
    }
  }
  // end Trig lib

  init();
  // new pencil
  var myPencil = new Pencil( canvas, context, 1, '#000000', 'myPencil' );
  
  $(document).ready(function() {

    //$('#sketch').mousedown({_x:0, _y:0});
    $('#undo').on('click', myPencil.undo);
    $('#redo').on('click', myPencil.redo);
    $('#clear').on('click', myPencil.clear);
    $('#reset').on('click', myPencil.reset);
    $('#save_pencil').on('click', myPencil.saveTool);
    $('#replay').on('click', myPencil.replay);
    $('#add_text').on('click', {selector: '#text_input'}, myPencil.addText);

    $('#export').on('click', myPencil.export);

    $('#colour_select').on('change', function() {
      console.log('colour change');
      console.log(this.value);
      myPencil.colour = this.value;
      //context.strokeStyle = this.value;
    });
    $('#stroke_select').on('change', function() {
      console.log('stroke change');
      // console.log(this.value);
      myPencil.stroke = parseInt((this.value/5), 10);
      //context.lineWidth = parseInt((this.value/5), 10);
    });

    $('#playback').on('change', function() {
      var val = this.value/1000;
      console.log('position', val);
      myPencil.playback(val);
    });
    // test responsive
    // $(window).resize( respondCanvas );

  });

// })();




if ( 1 === 2 ) {

var cmds = [];
 
 
var start_time = new Date().getTime();
cmds.push( start_time - new Date().getTime() );
 
cmds.push( start_time - new Date().getTime() );
cmds.push( start_time - new Date().getTime() );
 
 
var end_time =  new Date().getTime() - start_time ;
var duration = end_time - start_time ;
 
cmds = cmds.splice(0, index_offset);
 
var timescale = 1;
var start_time = new Date().getTime();
var playback_cmd = JSON.parse(JSON.stringify(cmds));
var index_offset;
 
/*
function renderLoop(){
  var now = (new Date().getTimer()*timescale) - start_time;
  if(playback_cmd[0]<now && playback_cmd.lengt >0 ){
                  //issue cmd
                  App.invoke(cmd[0])
                  index_offset++;
                  playback_cmd.unshift();
  }

}
*/

}