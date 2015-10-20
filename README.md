[![Dependency Status](https://gemnasium.com/santilland/plotty.svg)](https://gemnasium.com/santilland/plotty)

plotty
===============

Library for helping plot 2D data and provide colorscale functionality.

Index file working locally can be found in lib folder.

Bower install
```
bower install --save santilland/plotty
```

Just include script to site and add a canvas element where you want to render the data.
```
<head>
	<script src="lib/plotty.min.js"></script>
</head>
<body>
	<canvas id="canvas1" width=100 height=100></canvas>
</body>
```


 and render using different color scales 
 ```
 // Generate or load some data (Working with buffer arrays for now)
var width = 100;
var height = 100;
var exampledata = new Float32Array(height*width);

var xoff = width / 3; // offsets to "center"
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


var el = document.getElementById("canvas");
plot = new plotty.plot(el, exampledata, width, height, [-1, 1], "viridis" );
//                    (canvas, data, width, height, [range], [colorscale])
plot.render();
 ```

There is a list of predefined colorscales:
 * viridis
 * inferno
 * rainbow
 * jet
 * hsv
 * hot
 * cool
 * spring
 * summer
 * autumn
 * winter
 * bone
 * copper
 * greys
 * yignbu
 * greens
 * yiorrd
 * bluered
 * rdbu
 * picnic
 * portland
 * blackbody
 * earth
 * electric
 * magma
 * plasma

 It is also possible to define your own colorscale by using
 ```
 plotty.addColorScale("mycolorscale", ["#00ff00","#0000ff","#ff0000"], [0,0.5,1]);
 //                   (identifier   ,  color_steps,                  , percentage_steps) 
 ```


| Some example result renderings  |
|:-------------------------------:|
| ![Example plotty rendering](https://cloud.githubusercontent.com/assets/4036819/10050683/dd814e46-621d-11e5-9b63-2d0d5b81e0bd.png) |
| ![Second Example plotty rendering](https://cloud.githubusercontent.com/assets/4036819/10069591/65034254-62ad-11e5-81e1-19a91ee46a5c.png) |







 

