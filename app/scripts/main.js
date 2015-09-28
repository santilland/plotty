

var width = 1354;
var height = 2030;

var min_range = 220;
var max_range = 300;

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

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = "arraybuffer";
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.response);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

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


function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object

	// Loop through the FileList and render image files as thumbnails.
	for (var i = 0, f; f = files[i]; i++) {

  		var reader = new FileReader();
  		reader.onload = function (e) {
        	var data = new Uint16Array(e.target.result);

        	//plot = new plotty.plot([min_range,max_range], el, data, width, height, showvalue, colorscale_id);
					plot.setData(data, 1354, 2040);
			plot.render();
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

//plot = new plotty.plot([-1,1], el, exampledata, ex_width, ex_height, showvalue, "viridis");
//plot.render();



min_range_slider.oninput=function(){
	if(plot){
		min_range = parseFloat(this.value);
		min_range.innerHTML = min_range;
		plot.setDomain([min_range, max_range],3);
		plot.render();
	}
};

min_range_slider.onchange=function(){
	if(plot){
		now = new Date().getTime();
		min_range = parseFloat(this.value);
		plot.setDomain([min_range, max_range],3);
		plot.render();
	}
};


max_range_slider.oninput=function(){
	if(plot){
		now = new Date().getTime();
		max_range = parseFloat(this.value);
		max_label.innerHTML = max_range;
		plot.setDomain([min_range, max_range],3);
		plot.render();
	}
};

max_range_slider.onchange=function(){
	if(plot){
		now = new Date().getTime();
		max_range = parseFloat(this.value);
		plot.setDomain([min_range, max_range],3);
		plot.render();
	}
};

colorscaleselect.onchange=function(){
	colorscale_id = this.value;
	if(plot) {
		plot.setScale(colorscales[this.value]);
		plot.render();

		var myNode = document.getElementById("colorscale");
		while (myNode.firstChild) {
		  myNode.removeChild(myNode.firstChild);
		}
		/*var scaleImage = plot.getScaleImage();
		scaleImage.style.width = "500px";
		scaleImage.style.height = "20px";
		document.body.appendChild(scaleImage);
		myNode.appendChild(scaleImage);*/
	}
};




