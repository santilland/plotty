

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};



/* helper function that could be maybe useful?*/
function scaleImageData(imageData, scale) {
    var scaled = ctx.createImageData(imageData.width * scale, imageData.height * scale);
    var subLine = ctx.createImageData(scale, 1).data
    for (var row = 0; row < imageData.height; row++) {
        for (var col = 0; col < imageData.width; col++) {
            var sourcePixel = imageData.data.subarray(
                (row * imageData.width + col) * 4,
                (row * imageData.width + col) * 4 + 4
            );
            for (var x = 0; x < scale; x++) subLine.set(sourcePixel, x*4)
            for (var y = 0; y < scale; y++) {
                var destRow = row * scale + y;
                var destCol = col * scale;
                scaled.data.set(subLine, (destRow * scaled.width + destCol) * 4)
            }
        }
    }

    return scaled;
}


var plotty = new function() {

    
    // Colorscale definitions
    var rainbow = 	chroma.scale(
                       ['#96005A', '#0000C8', '#0019FF', '#0098FF', '#2CFF96', '#97FF00', '#FFEA00', '#FF6F00', 'FF0000'], // colors
                       [0, .125, .25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]  // positions
                   	);
    var jet = 		chroma.scale(
                       ['#000083', '#003CAA', '#05FFFF', '#FFFF00', '#FA0000', '#800000'], // colors
                       [0, .125, 0.375, 0.625, 0.875, 1]  // positions
                   	); 
    var test = 		chroma.scale(
                       ['#000', '#800000'], // colors
                       [0, 1]  // positions
                   	); 
    var viridis =    chroma.scale(
                       ['#440154', '#472b7a', '#3b518a', '#2c718e', '#218e8c', '#26ac81', '#59c764', '#a7db33', '#fde724'], // colors
                       [0, .125, .25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]  // positions
                    ); 
	
	
    // Plot tool
    this.plot = function (domain, el, data, width, height) {
       this.domain = domain;
       this.data = data;
       el.width = width;
       el.height = height;
       this.ctx = el.getContext("2d");

       this.width = width;
       this.height = height;
       this.ctx.scale(3,1);
       this.colorscale = jet;
       this.colorscale.domain(this.domain, 200);
       this.imageData = this.ctx.createImageData(this.width, this.height);
    };

    this.plot.prototype.updateDomain = function updateDomain(domain){
    	this.domain = domain;
    	this.colorscale.domain(this.domain, 200);
    	this.render();
    };

    this.plot.prototype.updateScale = function updateScale(scale){
    	var cs = null;
    	switch(scale){
    		case "jet": cs = jet; break;
    		case "rainbow": cs = rainbow; break;
        case "viridis": cs = viridis; break;
    		case "test": cs = test; break;
    	}

    	if (cs){
    		this.colorscale = cs;
    		this.colorscale.domain(this.domain, 200);
    		this.render();
    	}
    };

    this.plot.prototype.render = function render(){

    	var t0 = performance.now();

      var arraySize = this.width * this.height;

      for (var idx = 0; idx < arraySize; idx++) {
        var index = idx*4;
    		if(this.data[idx]==0){
          this.imageData.data[index+0] = 0;
          this.imageData.data[index+1] = 0;
          this.imageData.data[index+2] = 0;
          this.imageData.data[index+3] = 0;
        } else{
          var index = idx*4;
          var c = this.colorscale(this.data[idx])._rgb;
          //var c = [1,0,0,1];

          this.imageData.data[index+0] = c[0];
          this.imageData.data[index+1] = c[1];
          this.imageData.data[index+2] = c[2];
          this.imageData.data[index+3] = 255;
        }


      }

    var t1 = performance.now();
    looptime+=(t1-t0);


    console.log("Render took " + (t1 - t0) + " milliseconds.")

		this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
    var t2 = performance.now();
    rendertime+=(t2-t1);

		
    };

    this.plot.prototype.getColor = function getColor(val){
    	return this.colorscale(val);
    };


}

