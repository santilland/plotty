

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

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    var ratio_x = canvas.width/evt.target.offsetWidth;
    var ratio_y = canvas.height/evt.target.offsetHeight;
    return {
      x: Math.round((evt.clientX - rect.left)*ratio_x),
      y: Math.round((evt.clientY - rect.top)*ratio_y)
    };
}


var plotty = new function() {

    
    // Colorscale definitions
    var colorscales = {
      "rainbow": chroma.scale(
        ['#96005A', '#0000C8', '#0019FF', '#0098FF', '#2CFF96', '#97FF00', '#FFEA00', '#FF6F00', 'FF0000'], // colors
        [0, .125, .25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]  // positions
      ),
      "jet": chroma.scale(
        ['#000083', '#003CAA', '#05FFFF', '#FFFF00', '#FA0000', '#800000'], // colors
        [0, .125, 0.375, 0.625, 0.875, 1]  // positions
     	),
      "viridis": chroma.scale(
        ['#440154', '#472b7a', '#3b518a', '#2c718e', '#218e8c', '#26ac81', '#59c764', '#a7db33', '#fde724'], // colors
        [0, .125, .25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]  // positions
      )
    };
	
	
    // Plot tool
    this.plot = function (domain, el, data, width, height, callback_value, scale_id) {
       this.domain = domain;
       this.data = data;

       el.width = width;
       el.height = height;

       this.el = el;

       this.ctx = el.getContext("2d");

       this.width = width;
       this.height = height;
       
       if (!scale_id) scale_id="jet";
       this.colorscale = colorscales[scale_id];
       this.colorscale.domain(this.domain, 200);
       this.imageData = null;

       var self = this;

       function mouseovervalue(e) {
          var pos = getMousePos(self.el, e);
          callback_value(self.data[(pos.y*this.width)+pos.x]);
        }
        this.el.addEventListener('mousemove', mouseovervalue, false);
    };

    this.plot.prototype.updateDomain = function updateDomain(domain,subsample){
    	this.domain = domain;
    	this.colorscale.domain(this.domain, 200);
    	this.render(subsample);
    };

    this.plot.prototype.updateScale = function updateScale(scale){
    	if (colorscales[scale]){
    		this.colorscale = colorscales[scale];
    		this.colorscale.domain(this.domain, 200);
    		this.render();
    	}
    };

    this.plot.prototype.render = function render(subsample){

    	var t0 = performance.now();

      if (!subsample) {subsample=1;};
      var subset = subsample;

      var w_sub = Math.floor(this.width/subset);
      var h_sub = Math.floor(this.height/subset);

      this.el.width = w_sub;
      this.el.height = h_sub;

      this.imageData = this.ctx.createImageData(w_sub, h_sub);

      for (var y = 0; y < h_sub; y++) {
        for (var x = 0; x < w_sub; x++) {
        

          var i = (((y*subset))*this.width)+((x)*subset);

          // TODO: Think about this, when subsampling there is a displacement
          // this helps reduce this but there is probably a better way
          if(subset>1){
            i = (((y*subset)+1)*this.width)+((x+1)*subset);
          }

          var index = ((y*w_sub)+x)*4;

      		if(this.data[i]==0){
            this.imageData.data[index+0] = 0;
            this.imageData.data[index+1] = 0;
            this.imageData.data[index+2] = 0;
            this.imageData.data[index+3] = 0;
          } else{
            var c = this.colorscale(this.data[i])._rgb;

            this.imageData.data[index+0] = c[0];
            this.imageData.data[index+1] = c[1];
            this.imageData.data[index+2] = c[2];
            this.imageData.data[index+3] = 255;
          }

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

