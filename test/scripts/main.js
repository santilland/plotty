

var width = 500;
var height = 500;

var min_range = -100;
var max_range = 100;

var histogram_buckets = 50;


var plot = false;

var colorscale_id = false;


var el = document.getElementById("canvas");

var colorscaleselect = document.getElementById("colorscaleselect");

// Get sliders
var min_range_slider = document.getElementById("min");
var max_range_slider = document.getElementById("max");

var clamp_low_check = document.getElementById("clamp_low");
var clamp_high_check = document.getElementById("clamp_high");

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


function handleFileSelect(evt) {

    width = 1354;
    height = 2030;

    min_range = 11000;
    max_range = 13000;

    min_range_slider.max = max_range;
    min_range_slider.min = min_range;
    min_label.innerHTML = min_range;
    min_range_slider.value = min_range;

    max_range_slider.max = max_range;
    max_range_slider.min = min_range;
    max_range_slider.value = max_range;
    max_label.innerHTML = max_range;

    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = new Uint16Array(e.target.result);
            plot = new plotty.plot(el, data, width, height, [min_range, max_range], "viridis" );
            plot.setData(data, width, height);
            plot.setDomain([min_range, max_range]);
            plot.setNoDataValue(0);
            plot.render();
            /*drawHistogram(
                calculateHistogram(plot.getData(), [min_range, max_range], histogram_buckets));*/
        };
        reader.onerror = function (e) {
            console.error(e);
        };

        reader.readAsArrayBuffer(f);
    }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);



// Generate data
var exampledata = new Float32Array(height*width);
var exampledata_new = new Float32Array(height*width);

var xoff = width / 3; // offsets to "center"
var yoff = height / 3;


for (var y = 0; y <= height; y++) {
    for (var x = 0; x <= width; x++) {
        // calculate sine based on distance
        var x2 = x - xoff;
        var y2 = y - yoff;
        var d = Math.sqrt(x2*x2 + y2*y2);
        var t = Math.sin(d/6.0);
        // save sine
        exampledata[(y*width)+x] = t*100;
        var t2 = Math.cos(d/6.0);
        exampledata_new[(y*width)+x] = t2*100;
    }
}



plotty.addColorScale("test", ["#00ff00","#0000ff","#ff0000"], [0,0.5,1]);


for(var cm in plotty.colorscales){
    var option = document.createElement("option");
    option.text = cm;
    option.value = cm;
    if (cm == "viridis")
        option.selected = true;
    colorscaleselect.add(option);
}


var matrix = [
    0.2, 0, 0,
    0, 0.6, 0,
    0, 0, 1
];

plot = new plotty.plot({
    canvas: el, width: width, height: height,
    domain: [min_range, max_range], colorScale: "viridis",
    //useWebGL: false,
    //matrix : matrix,
    //displayRange: [min_range/2, max_range/2],
    //applyDisplayRange: true
});

//plot.setDisplayRange([min_range/2, max_range/2]);

plot.setClamp(clamp_low_check.checked, clamp_high_check.checked);

plot.addDataset('dataset1', exampledata, width, height);
// plot.addDataset('dataset2', exampledata_new, width, height);

// plot.setExpression('(1.2 ** -3) * abs(dataset1 * 2 + 0.1 * dataset2)');
plot.render();


// Example for loading Data through HttpRequest
/*

var xhr = new XMLHttpRequest();
xhr.open('GET', 'data/FSL_2015051619.blob', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  var responseArray = new Uint16Array(this.response);
    plot = new plotty.plot(el, responseArray, 1354, 2030, [min_range, max_range], "viridis", false );
    plot.render();
    // drawHistogram(
    //  calculateHistogram(plot.getData(), [min_range, max_range], histogram_buckets));
};

xhr.send();

*/



function calculateHistogram(data, domain, bucketCount) {
    var min = domain[0], max = domain[1];
    var range = (max-min);
    var histogram = new Array(bucketCount);
    for (var i = 0; i < bucketCount; ++i) {
        histogram[i] = 0;
    }

    for (var j = 0; j < data.length; ++j) {
        var value = data[j];
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
        plot.setDomain([min_range, max_range]);
        //plot.setDisplayRange([min_range, max_range]);
        plot.render();

        /*drawHistogram(
            calculateHistogram(plot.getData(), [min_range, max_range], histogram_buckets));*/
    }
};

min_range_slider.onchange=function(){
    if(plot){
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
        plot.setDomain([min_range, max_range]);
        //plot.setDisplayRange([min_range, max_range]);
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
        plot.setColorScale(colorscale_id);
        plot.render();
    }
};

clamp_low_check.onchange = clamp_high_check.onchange = function() {
    if(plot) {
        plot.setClamp(clamp_low_check.checked, clamp_high_check.checked);
        plot.render();
    }
}


