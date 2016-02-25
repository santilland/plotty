
plotty
======

plotty is a library for helping plot 2D data and provide color scaling
functionality. Put your array data in it and receive a fresh image.


Installation
------------

Installation with Bower:
```bash
bower install --save santilland/plotty
```

Installation with npm:
```bash
npm install plotty --save
```
Docs
----
http://santilland.github.io/plotty/

Usage
-----

Just include script to site and add a canvas element where you want to render the data.
```html
<head>
	<script src="dist/plotty.min.js"></script>
</head>
<body>
	<canvas id="canvas" width=100 height=100></canvas>
</body>
```

and render using predefined settings:
```javascript
// Generate or load some data (Working with buffer arrays for now)
var width = 100;
var height = 100;
var exampledata = new Float32Array(height * width);

var xoff = width / 3;
var yoff = height / 3;

for (y = 0; y <= height; y++) {
	for (x = 0; x <= width; x++) {
		// calculate sine based on distance
		x2 = x - xoff;
		y2 = y - yoff;
		d = Math.sqrt(x2*x2 + y2*y2);
		t = Math.sin(d/6.0);

		// save sine
		exampledata[(y*width)+x] = t;
	}
}

plot = new plotty.plot({
	canvas: document.getElementById("canvas"),
	data: exampledata, width: width, height: height,
	domain: [-1, 1], colorScale: 'viridis'
});
plot.render();
```

There is a list of predefined colorscales:

|           |             |            |
| --------- | ----------- | ---------- |
| viridis   | inferno     | rainbow    |
| jet       | hsv         | hot        |
| cool      | spring      | summer     |
| autumn    | winter      | bone       |
| copper    | greys       | yignbu     |
| greens    | yiorrd      | bluered    |
| rdbu      | picnic      | portland   |
| blackbody | earth       | electric   |
| magma     | plasma      |            |


It is also possible to define your own colorscale using the `addColorScale` function.
```javascript
plotty.addColorScale("mycolorscale", ["#00ff00", "#0000ff", "#ff0000"], [0, 0.5, 1]);
//                  ( identifier   ,  color_steps,                    , percentage_steps) 
```

Examples
--------

Generated data:

![Example plotty rendering](https://cloud.githubusercontent.com/assets/4036819/10050683/dd814e46-621d-11e5-9b63-2d0d5b81e0bd.png)

Scientific data:

![Second Example plotty rendering](https://cloud.githubusercontent.com/assets/4036819/10069591/65034254-62ad-11e5-81e1-19a91ee46a5c.png)
