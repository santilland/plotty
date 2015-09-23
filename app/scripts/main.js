

var width = 1354;
var height = 2030;

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

var colorscale_id = false;


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

  		var reader = new FileReader();
  		reader.onload = function (e) {
        	var data = new Uint16Array(e.target.result);
        	plot = new plotty.plot([min_range,max_range], el, data, width, height, showvalue, colorscale_id);
			plot.render();
    	};
    	reader.onerror = function (e) {
        	console.error(e);
    	};

  		reader.readAsArrayBuffer(f);
	}
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);


// Generate data
var ex_width = 100;
var ex_height = 100;
var exampledata = new Float32Array(ex_height*ex_width);

var xoff = ex_width / 3; // offsets to "center"
var yoff = ex_height / 3;

// walk left-to-right, top-to-bottom; it's the
// same as the ordering in the imagedata array:

for (y = 0; y <= height; y++) {
	for (x = 0; x <= width; x++) {
		// calculate sine based on distance
		x2 = x - xoff;
		y2 = y - yoff;
		d = Math.sqrt(x2*x2 + y2*y2);
		t = Math.sin(d/6.0);

		// save sine
		exampledata[(y*ex_width)+x] = t;
	}
}

plot = new plotty.plot([-1,1], el, exampledata, ex_width, ex_height, showvalue, "viridis");
plot.render();


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
	colorscale_id = this.value;
	if(plot)
		plot.updateScale(this.value);
};




