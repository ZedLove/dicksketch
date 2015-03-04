var Pencil = function ( canvas, context, stroke, colour, name ) {
// console.log( canvas, context, stroke, colour, name );

// undo array
this.history = [];
// redo array
this.undo_history = [];

// actions array (canvas actions as input commands)
this.recorded_actions = [];

// save frames for gif-ing
this.frames = [];

// relevant drawing settings
this.canvas  = canvas;
this.context = context;
this.stroke  = stroke;
this.colour  = colour;
this.name    = name;

this.started = false;

var pencil = this;

this.mousedown = function (e) {
//console.log(pencil);

// console.log('MOUSEDOWN');
// console.log('this.colour', pencil.colour);
// console.log('this.stroke', pencil.stroke);
    // update colour and stroke
    context.strokeStyle = pencil.colour;
    context.lineWidth   = pencil.stroke;
    context.moveTo(e._x, e._y);
    context.beginPath();

    // record action coords
    pencil.recorded_actions.push({
      timestamp: new Date().getTime(),
      type: 'moveTo',
      x: e._x,
      y: e._y,
      stroke: pencil.stroke,
      colour: pencil.colour}
    );
    pencil.saveFrame();
    pencil.started = true;
};

this.mousemove = function (e) {
  if (pencil.started) {
// console.log('MOUSEMOVE');
// console.log('this.colour', pencil.colour);
// console.log('this.stroke', pencil.stroke);
    context.strokeStyle = pencil.colour;
    context.lineWidth   = pencil.stroke;
    context.lineTo(e._x, e._y);
    // store action for playback
    pencil.recorded_actions.push({
      timestamp: new Date().getTime(),
      type: 'lineTo',
      x: e._x,
      y: e._y,
      stroke: pencil.stroke,
      colour: pencil.colour}
    );
    pencil.saveFrame();
    context.stroke();
  }
};

this.mouseup = function ( e ) {
// console.log('MOUSEUP');
  if (pencil.started) {
    pencil.mousemove(e);
    pencil.started = false;
  }

  if (log_recorded_actions) {
    // recorded actions stuff
    console.log('RECORDED ACTIONS');
    console.log(pencil.recorded_actions);
    console.log('END RECORDED ACTIONS');
  }
};

this.addText = function( e ) {
// console.log('selector', e.data.selector);
  var text = $(e.data.selector).val();
// console.log('text', text);

  pencil.font = context.font = 'bold 40px Lato';
  // context.fillText(text, 150, 100);
  fabCanvas.add(text);

  // store action for playback
    pencil.recorded_actions.push({
      timestamp: new Date().getTime(),
      type: 'fillText',
      x: e.data.x,
      y: e.data.y,
      font: context.font,
      text: text}
    );
    context.stroke();
};

this.saveFrame = function() {
    var imgData = pencil.context.getImageData( 0, 0, canvas.width, canvas.height );
    pencil.frames.push(imgData.data);
};

this.playback = function(position) {
  
  var max = Math.floor(pencil.recorded_actions.length * position);
  // clear context
  context.clearRect(0, 0, canvas.width, canvas.height);
  console.log('max: ', max);
  console.log('rec_act length', pencil.recorded_actions.length);

  // setInterval(function() {
  //   this.recorded_actions[i].timestamp
  // }, 100);


  if (pencil.recorded_actions) {
    for (var i = 0; i < max; i++) {
      if (pencil.recorded_actions[i].type == 'moveTo') {
        if (log_undo_actions) {
          console.log('playback moveTo', pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
        }
        context.strokeStyle = pencil.recorded_actions[i].colour;
        context.lineWidth = pencil.recorded_actions[i].stroke;
        context.moveTo(pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
        context.beginPath();
      }
      else if (pencil.recorded_actions[i].type == 'lineTo') {
        if (log_undo_actions) {
          console.log('playback lineTo', pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
        }
        context.strokeStyle = pencil.recorded_actions[i].colour;
        context.lineWidth = pencil.recorded_actions[i].stroke;
        context.lineTo(pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
        context.stroke();
      }
    };
  }
};

this.replay = function( notFirstLoop, iterator ) {

  if (pencil.recorded_actions && typeof pencil.recorded_actions !== 'undefined' && pencil.recorded_actions !== null) {
    if ( notFirstLoop && typeof iterator != 'undefined' && iterator != null ) {
      var i = iterator + 1;

      // don't exceed length of recorded actions
      if (i >= ( pencil.recorded_actions.length - 1) ) {
        return;
      }
    }
    else {
      var i = 0;
      // only clear on first loop
      pencil.clear();
    }
    var i_plus    = i + 1,
        startTime = pencil.recorded_actions[i].timestamp,
        nextTime  = pencil.recorded_actions[i_plus].timestamp,
        dTime     = nextTime - startTime;

    if (pencil.recorded_actions[i].type == 'moveTo') {
      if (log_undo_actions) {
        console.log('replay moveTo', pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
      }
      context.strokeStyle = pencil.recorded_actions[i].colour;
      context.lineWidth = pencil.recorded_actions[i].stroke;
      context.moveTo(pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
      context.beginPath();
    }
    else if (pencil.recorded_actions[i].type == 'lineTo') {
      if (log_undo_actions) {
        console.log('replay lineTo', pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
      }
      context.strokeStyle = pencil.recorded_actions[i].colour;
      context.lineWidth = pencil.recorded_actions[i].stroke;
      context.lineTo(pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
      context.stroke();
    }
    
      // request new frame
      requestAnimFrame(function() {
        // pass 'true' bc it is NOT first loop on this call
        pencil.replay( true, i );
      });
  }
};

this.undo = function() {
  
  console.log('undo');
  var max = Math.floor(pencil.recorded_actions.length );
  // clear context
  context.clearRect(0, 0, canvas.width, canvas.height);
  console.log('max: ', max);

  if (pencil.recorded_actions) {
    for (var i = 0; i < max; i++) {
      if (pencil.recorded_actions[i].type == 'moveTo') {
        if (log_undo_actions) {
          console.log('playback moveTo', pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
        }
        context.strokeStyle = pencil.recorded_actions[i].stroke;
        context.lineWidth = pencil.recorded_actions[i].colour;
        context.moveTo(pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
        context.beginPath();
      }
      else if (pencil.recorded_actions[i].type == 'lineTo') {
        if (log_undo_actions) {
          console.log('playback lineTo', pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
        }
        context.strokeStyle = pencil.recorded_actions[i].stroke;
        context.lineWidth = pencil.recorded_actions[i].colour;
        context.lineTo(pencil.recorded_actions[i].x, pencil.recorded_actions[i].y);
        context.stroke();
      }
    };
  }
};

this.redo = function() {
  console.log('redo');
  console.log(pencil.history);

};

this.clear = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'rgb( 255, 255, 255)';
  context.fillRect( 0, 0, canvas.width, canvas.height);
};

this.reset = function() {
  pencil.clear();
  pencil.recorded_actions = [];
  pencil.frames = [];
};

this.export = function() {
  if (pencil.frames.length !== 0) {
    console.log('exporting with web worker');
    var worker = new Worker('doWork.js');

    worker.addEventListener('message', function(e) {
      console.log('Worker said: ', e.data);
    }, false);

    worker.postMessage('Hello World');
  }
  else {
    alert('nothing to export');
  }
};

// BRUSHES?
/*
var halfBrushW = this.brush.width/2;
var halfBrushH = this.brush.height/2;

var start = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };
this.updateMousePosition( event );
var end = { x:this.lastMousePoint.x, y: this.lastMousePoint.y };

var distance = parseInt( Trig.distanceBetween2Points( start, end ) );
var angle = Trig.angleBetween2Points( start, end );

var x,y;

for ( var z=0; (z<=distance || z==0); z++ )
{
  x = start.x + (Math.sin(angle) * z) - halfBrushW;
  y = start.y + (Math.cos(angle) * z) - halfBrushH;
  //console.log( x, y, angle, z );
  this.context.drawImage(this.brush, x, y);
} 
*/
// end BRUSHES?



current_pencil = name;

this.saveTool = function() {
  console.log('saving '+current_pencil);
    saved_pencils.push(pencil.stroke, pencil.colour, current_pencil);
};

}
// end Pencil constructor


/***********************
 *    LIB FUNCTIONS    *
 **********************/


// canvas event handler
  function ev_canvas (e) {

    if (e.layerX || e.layerX == 0) { // Firefox
      e._x = e.layerX;
      e._y = e.layerY;
    } else if (e.offsetX || e.offsetX == 0) { // Opera
      e._x = e.offsetX;
      e._y = e.offsetY;
    }

    // Call the event handler of the tool.
    var func = myPencil[e.type];
    if (func) {
      func(e);
    }
  }

  function fadeIn(el) {
    el.style.opacity = 0;

    var last = new Date().getTime();
    var tick = function() {
      el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
      last = new Date().getTime();

      if (+el.style.opacity < 1) {
        requestAnimFrame( function(){tick();} );
      }
    };

    tick();
  }

  function fadeOut(el) {
    console.log('fade out');
    el.style.opacity = 1;

    var last = new Date().getTime();
    var tick = function() {
      el.style.opacity = +el.style.opacity - (new Date() - last) / 400;
      last = new Date().getTime();
      
      if (+el.style.opacity > 0) {
        requestAnimFrame( function(){tick();} );
      }
    };

    tick();
  }