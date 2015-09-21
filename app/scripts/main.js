

var width = 1355;
var height = 2031;

var min_range = 0;
var max_range = 20000;

var lastupdate = new Date().getTime();
var now = null;


var rendertime = 0;
var looptime = 0;


//var farray = new Float32Array(width*height);


var el = document.getElementById("canvas1");

// Get sliders
var min_range_slider = document.getElementById("min");
var max_range_slider = document.getElementById("max");

min_range_slider.max = max_range;
min_range_slider.min = min_range;
min_range_slider.value = min_range;
document.getElementById("min_label").innerHTML = min_range;

max_range_slider.max = max_range;
max_range_slider.min = min_range;
max_range_slider.value = max_range;
document.getElementById("max_label").innerHTML = max_range;



var colorscaleselect = document.getElementById("colorscaleselect");


var plot = new plotty.plot([min_range,max_range], el, LST3, width, height);
plot.render();

/*for (var i=100; i>0; i--){
	min_range = (i/100)*80;
	plot.updateDomain([min_range, max_range]);
}

console.log("Looptime: "+looptime);
console.log("Render time: "+rendertime);*/


min_range_slider.oninput=function(){
	now = new Date().getTime();
	min_range = parseFloat(this.value);
	if (now - lastupdate>20)
		plot.updateDomain([min_range, max_range]);
	lastupdate = now;
};
max_range_slider.oninput=function(){
	now = new Date().getTime();
	max_range = parseFloat(this.value);
	if (now - lastupdate>20)
		plot.updateDomain([min_range, max_range]);
	lastupdate = now;
};

colorscaleselect.onchange=function(){
	plot.updateScale(this.value);
};




