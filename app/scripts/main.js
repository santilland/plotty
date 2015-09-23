

var width = 1354;
var height = 2040;

var min_range = 11000;
var max_range = 13600;

/*var width = 361;
var height = 180;

var min_range = -80;
var max_range = 120;*/

var lastupdate = new Date().getTime();
var now = null;


var rendertime = 0;
var looptime = 0;

var plot = false;


//var farray = new Float32Array(width*height);


var el = document.getElementById("canvas1");

// Get sliders
var min_range_slider = document.getElementById("min");
var max_range_slider = document.getElementById("max");

min_range_slider.max = max_range;
min_range_slider.min = min_range;
min_range_slider.value = min_range;
var min_label = document.getElementById("min_label");
min_label.innerHTML = min_range;

max_range_slider.max = max_range;
max_range_slider.min = min_range;
max_range_slider.value = max_range;
var max_label = document.getElementById("max_label");
max_label.innerHTML = max_range;

var measurevalue = document.getElementById("measurevalue");

function showvalue (val) {
	measurevalue.innerHTML = "Value: "+val;
}


  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
     /* if (!f.type.match('image.*')) {
        continue;
      }*/

      var reader = new FileReader();
      reader.onload = function (e) {
	        var data = new Uint16Array(e.target.result);
	        plot = new plotty.plot([min_range,max_range], el, data, width, height, showvalue);
			plot.render();
	    };
	    reader.onerror = function (e) {
	        console.error(e);
	    };

      reader.readAsArrayBuffer(f);
    }
  }

  document.getElementById('files').addEventListener('change', handleFileSelect, false);


/*for (var i=100; i>0; i--){
	min_range = (i/100)*80;
	plot.updateDomain([min_range, max_range]);
}

console.log("Looptime: "+looptime);
console.log("Render time: "+rendertime);*/


min_range_slider.oninput=function(){
	if(plot){
		now = new Date().getTime();
		min_range = parseFloat(this.value);
		min_label.innerHTML = min_range;
		if (now - lastupdate>20)
			plot.updateDomain([min_range, max_range],3);
		lastupdate = now;
	}
};

min_range_slider.onchange=function(){
	if(plot){
		now = new Date().getTime();
		min_range = parseFloat(this.value);
		if (now - lastupdate>20)
			plot.updateDomain([min_range, max_range]);
		lastupdate = now;
	}
};


max_range_slider.oninput=function(){
	if(plot){
		now = new Date().getTime();
		max_range = parseFloat(this.value);
		max_label.innerHTML = max_range;
		if (now - lastupdate>20)
			plot.updateDomain([min_range, max_range],3);
		lastupdate = now;
	}
};

max_range_slider.onchange=function(){
	if(plot){
		now = new Date().getTime();
		max_range = parseFloat(this.value);
		if (now - lastupdate>20)
			plot.updateDomain([min_range, max_range]);
		lastupdate = now;
	}
};

colorscaleselect.onchange=function(){
	if(plot)
		plot.updateScale(this.value);
};




