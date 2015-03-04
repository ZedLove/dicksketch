var Export = function() {

    self.addEventListener('message', function(e) {
      self.postMessage(e.data);
    }, false);
  
    console.log('export');
/*

    var encoder   = new GIFEncoder(),
        progDiv   = document.getElementById('progress'),
        progNum   = document.getElementById('progress_num'),
        progTotal = document.getElementById('progress_total'),
        i         = 0; // used in progress bar loop

    progTotal.innerHTML = ''+pencil.frames.length;

    encoder.setRepeat(0);
    encoder.setDelay(150);
    encoder.start();
    // using imgDataArray, must call setSize()
    encoder.setSize( canvasWidth, canvasHeight );

    fadeIn( progDiv );
    progress();
  var progress = function (){
      var timer = window.setInterval(function(){
      console.log('i: '+i);
      i++;
      if( i == pencil.frames.length ){
        window.clearInterval( timer );
        fadeOut( progDiv );
        encoder.finish();
        var binary_gif = encoder.stream().getData();
        var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
        console.log(data_url);
        var img = new Image;

        img.onload = function(){
        // Use the for-sure-loaded img here
        document.getElementById('export_img').appendChild(img);
        };

        // THEN, set the src
        img.src = data_url;
      }
      else {
        encoder.addFrame( pencil.frames[i], true ); // second param true bc passing img data:url instead of canvas context
        progNum.innerHTML = i+1;
      }
     }, 100);
  };
*/








  // for (var i = 0; i < pencil.frames.length; i++) {
  //   encoder.addFrame( pencil.frames[i], true ); // second param true bc passing img data:url instead of canvas context
  // };

  // encoder.finish();
  // var binary_gif = encoder.stream().getData();
  // var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
  // console.log(data_url);
  // var img = new Image;

  // img.onload = function(){
  //   // Use the for-sure-loaded img here
  //   document.getElementById('export_img').appendChild(img);
  // };

  // // THEN, set the src
  // img.src = data_url;
};