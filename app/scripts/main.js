

var width = 1354;
var height = 2030;

// Placeholder just for testing purposes, there are multiple methods of getting the extent
// of the data which does not necessarely need to be covered by the library itself
var sizes = {
	'FSL_2015051619.blob': {width:1354, height:2030},
	'FSL_2015051634.blob': {width:1354, height:2030},
	'LST_2015051637.blob': {width:1354, height:2030},
	'LST_2015051638.blob': {width:1354, height:2030},
	'LST_2015051822.blob': {width:1354, height:2030},
	'LST_201505182256.blob': {width:1354, height:2030}
};

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

var histogram_buckets = 50;


//var farray = new Float32Array(width*height);


var el = document.getElementById("canvas");

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
  		reader.customsize = sizes[files[i].name];
  		reader.onload = function (e) {
        	var data = new Uint16Array(e.target.result);
        	//plot = new plotty.plot([min_range,max_range], el, data, width, height, showvalue, colorscale_id);
					plot.setData(data, this.customsize.width, this.customsize.height);
					plot.render();
					drawHistogram(
						calculateHistogram(plot.getData(), [min_range, max_range], histogram_buckets));
    	};
    	reader.onerror = function (e) {
        	console.error(e);
    	};

  		reader.readAsArrayBuffer(f);
	}
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);



function handleProductSelect(evt) {
	var request_url = "http://localhost:8080/ows?service=WPS&version=1.0.0&request=Execute&identifier=getArrayBuffer&DataInputs=coverage_id="+this.value+"&rawdataoutput=output";
	httpGetAsync(request_url, function (response) {
		var data = new Float32Array(response);
        	var l = data.length;
        	plot = new plotty2.plot(el, data, data[l-2], data[l-1], document.getElementById("rainbow"), [min_range, max_range]);
        	plot.setScale(colorscales["viridis"]);
			plot.setClamp(true);
			plot.render();
			drawHistogram(
						calculateHistogram(plot.getData(), [min_range, max_range], histogram_buckets));

	});
}

document.getElementById('productselect').addEventListener('change', handleProductSelect, false);



// Generate data
var ex_width = 100;
var ex_height = 100;
var exampledata = new Float32Array(ex_height*ex_width);

var xoff = ex_width / 3; // offsets to "center"
var yoff = ex_height / 3;
/*
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
}*/

var xhr = new XMLHttpRequest();
xhr.open('GET', 'data/FSL_2015051619.blob', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  var responseArray = new Uint16Array(this.response);
	plot = new plotty.plot(el, responseArray, 1354, 2030, [11000, 13600], "viridis" );
	colorscaleselect.onchange();
	//plot.setClamp(false);
	plot.render();
	/*drawHistogram(
		calculateHistogram(plot.getData(), [min_range, max_range], histogram_buckets));*/
};

xhr.send();

//plot = new plotty2.plot([-1,1], el, exampledata, ex_width, ex_height, showvalue, "viridis");
//plot = new plotty2.plot(el, exampledata, ex_width, ex_height, document.getElementById("rainbow"), [11000, 13600]);
//plot = new plotty.plot([-1,1], el, exampledata, ex_width, ex_height, showvalue, "viridis");
//plot.render();


/*for (var i=100; i>0; i--){
	min_range = (i/100)*80;
	plot.updateDomain([min_range, max_range]);
}

console.log("Looptime: "+looptime);
console.log("Render time: "+rendertime);*/


function calculateHistogram(data, domain, bucketCount) {
	var min = domain[0], max = domain[1];
	var range = (max-min);
	var histogram = new Array(bucketCount);
	for (var i = 0; i < bucketCount; ++i) {
		histogram[i] = 0;
	}

	for (var i = 0; i < data.length; ++i) {
		var value = data[i];
		if (value < min || value >= max)
			continue;
		var index = Math.round((value-min) / range * (bucketCount-1));
		histogram[index] += 1;
	}
	drawHistogram(histogram);
	return histogram;
}

function drawHistogram(histogram) {
	var canvas = document.getElementById("histogram");
	var ctx = canvas.getContext("2d");
	var max = Math.max.apply(null, histogram);
	var width = canvas.width;
	var height = canvas.height;

	ctx.clearRect(0, 0, width, height);

	ctx.beginPath();
	ctx.moveTo(0, histogram[0] / max * height);
	histogram.forEach(function(value, index) {
		var x = index / histogram.length * width;
		var y = value / max * height;
		ctx.lineTo(x, y);
		ctx.stroke();
	});
	ctx.closePath();
}


min_range_slider.oninput=function(){
	if(plot){
		min_range = parseFloat(this.value);
		min_label.innerHTML = min_range;
		plot.setDomain([min_range, max_range],3);
		plot.render();

		/*drawHistogram(
			calculateHistogram(plot.getData(), [min_range, max_range], histogram_buckets));*/
	}
};

min_range_slider.onchange=function(){
	if(plot){
		now = new Date().getTime();
		min_range = parseFloat(this.value);
		plot.setDomain([min_range, max_range],3);
		plot.render();

		/*drawHistogram(
			calculateHistogram(plot.getData(), [min_range, max_range], histogram_buckets));*/
	}
};


max_range_slider.oninput=function(){
	if(plot){
		max_range = parseFloat(this.value);
		max_label.innerHTML = max_range;
		plot.setDomain([min_range, max_range],3);
		plot.render();

		/*drawHistogram(
			calculateHistogram(plot.getData(), [min_range, max_range], histogram_buckets));*/
	}
};

max_range_slider.onchange=function(){
	if(plot){
		max_range = parseFloat(this.value);
		plot.setDomain([min_range, max_range],3);
		plot.render();

		/*drawHistogram(
			calculateHistogram(plot.getData(), [min_range, max_range], histogram_buckets));*/
	}
};

colorscaleselect.onchange=function(){
	colorscale_id = this.value;
	if(plot) {
		/*var scale = colorscales[this.value];
		plot.setScale(scale.colors, scale.positions);
		//plot.setScale(colorscales[this.value]);
		plot.render();

		var myNode = document.getElementById("colorscale");
		while (myNode.firstChild) {
		  myNode.removeChild(myNode.firstChild);
		}*/
		/*var scaleImage = plot.getScaleImage();
		scaleImage.style.width = "500px";
		scaleImage.style.height = "20px";
		document.body.appendChild(scaleImage);
		myNode.appendChild(scaleImage);*/
	}
};
