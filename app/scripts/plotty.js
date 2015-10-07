

plotty = new function() {

    
  // Colorscale definitions
  var colorscales = {
    "rainbow": {
      colors: ['#96005A', '#0000C8', '#0019FF', '#0098FF', '#2CFF96', '#97FF00', '#FFEA00', '#FF6F00', '#FF0000'],
      positions: [0, .125, .25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
    },
    "jet": {
      colors: ['#000083', '#003CAA', '#05FFFF', '#FFFF00', '#FA0000', '#800000'],
      positions: [0, .125, 0.375, 0.625, 0.875, 1]
    },
    "viridis": {
      colors: ['#440154', '#472b7a', '#3b518a', '#2c718e', '#218e8c', '#26ac81', '#59c764', '#a7db33', '#fde724'],
      positions: [0, .125, .25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
    }
  };


  function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      var ratio_x = canvas.width/evt.target.offsetWidth;
      var ratio_y = canvas.height/evt.target.offsetHeight;
      return {
        x: Math.round((evt.clientX - rect.left)*ratio_x),
        y: Math.round((evt.clientY - rect.top)*ratio_y)
      };
  }

  function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; }


  function create3DContext(canvas, opt_attribs) {
    var names = ["webgl", "experimental-webgl"];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
      try {
        context = canvas.getContext(names[ii], opt_attribs);
      } catch(e) {}  // eslint-disable-line
      if (context) {
        break;
      }
    }
    if (!context || !context.getExtension('OES_texture_float')) {
      //throw new Error("The Browser does not support WebGL or the float texture.");
      return null;
    }
    return context;
  }

  function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       x1, y1,
       x2, y1,
       x1, y2,
       x1, y2,
       x2, y1,
       x2, y2]), gl.STATIC_DRAW);
  }


  // Definition of vertex shader
  var vertexShaderSource = 
    'attribute vec2 a_position;\n'+
    'attribute vec2 a_texCoord;\n'+
   
    'uniform vec2 u_resolution;\n'+
    'varying vec2 v_texCoord;\n'+
    'void main() {\n'+
      '// convert the rectangle from pixels to 0.0 to 1.0\n'+
      'vec2 zeroToOne = a_position / u_resolution;\n'+
      '// convert from 0->1 to 0->2\n'+
      'vec2 zeroToTwo = zeroToOne * 2.0;\n'+
      '// convert from 0->2 to -1->+1 (clipspace)\n'+
      'vec2 clipSpace = zeroToTwo - 1.0;\n'+
      'gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n'+
      '// pass the texCoord to the fragment shader\n'+
      '// The GPU will interpolate this value between points.\n'+
      'v_texCoord = a_texCoord;\n'+
    '}';


  // Definition of fragment shader
  var fragmentShaderSource = 
    'precision mediump float;\n'+

    '// our textur\n'+
    'uniform sampler2D u_textureData;\n'+
    'uniform sampler2D u_textureScale;\n'+
    'uniform vec2 u_textureSize;\n'+
    'uniform vec2 u_domain;\n'+
    'uniform float u_noDataValue;\n'+
    'uniform bool u_clamp;\n'+

    '// the texCoords passed in from the vertex shader.\n'+
    'varying vec2 v_texCoord;\n'+

    'void main() {\n'+
      'vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n'+
      'float value = texture2D(u_textureData, v_texCoord)[0];\n'+
      'if (value == u_noDataValue)\n'+
        'gl_FragColor = vec4(0, 0, 0, 0);\n'+
      'else if (!u_clamp && (value < u_domain[0] || value > u_domain[1]))\n'+
        'gl_FragColor = vec4(0, 0, 0, 0);\n'+
      'else {\n'+
        'float normalisedValue = (value - u_domain[0]) / (u_domain[1] - u_domain[0]);\n'+
        'gl_FragColor = texture2D(u_textureScale, vec2(normalisedValue, 0));\n'+
      '}\n'+
    '}';
	
	
  // plot constructor
  var plot = function (canvas, data, width, height, domain, colorscale, mouseover) {
    
    // TODO: Considering saving dimensions directly in object
    // testing by overriding dimensions given, what is the best way
    // to provide both functionalities?
    var l = data.length;
    canvas.width = defaultFor(width, data[l-2]);
    canvas.height = defaultFor(height, data[l-2]);


    // Check if we can create webgl context and have supported float textures
    gl = this.gl = create3DContext(canvas);
    if(!gl)
      this.ctx = canvas.getContext("2d");

    this.setData(data,canvas.width, canvas.height);
    
    if(gl){
      // Create single canvas to render colorscales
      this.colorscaleCanvas = document.createElement('canvas');
      this.colorscaleCanvasCtx = this.colorscaleCanvas.getContext("2d");
      this.colorscaleCanvasCtx.width = 100;
      this.colorscaleCanvasCtx.height = 1;

      var vertexShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader, vertexShaderSource);
      gl.compileShader(vertexShader);
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(vertexShader));
        return null;
      }

      var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader, fragmentShaderSource);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(fragmentShader));
        return null;
      }

      var program = this.program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      gl.useProgram(this.program);

      // look up where the vertex data needs to go.
      var texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

      // provide texture coordinates for the rectangle.
      this.texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(texCoordLocation);
      gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

      /*this.setData(data, width, height);
      this.setDomain(domain);
      this.setScaleImage(colorscaleImage);
      this.setClamp(false);*/
    }
    
    this.setCanvas(canvas);
    this.setColorScale(defaultFor(colorscale, 'viridis'));
    this.setDomain(defaultFor(domain, [0,1]));

    this.imageData = null;


    var self = this;

    function mouseovervalue(e) {
      var pos = getMousePos(self.canvas, e);
      callback_value(self.data[(pos.y*this.width)+pos.x]);
    }
    this.canvas.addEventListener('mousemove', mouseovervalue, false);
  };

  plot.prototype.getData = function() {
    return this.data;
  };

  plot.prototype.setData = function(data, width, height) {
    if (this.gl){
      var gl = this.gl;
      this.textureData = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.textureData);

      // Set the parameters so we can render any size image.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      // Upload the image into the texture.
      gl.texImage2D(gl.TEXTURE_2D, 0,
        gl.LUMINANCE,
        width, height, 0,
        gl.LUMINANCE, gl.FLOAT, new Float32Array(data)
      );

    }

    this.data = data;
    this.width = width;
    this.height = height;

    
  };

  plot.prototype.getScaleImage = function() {
    return this.colorscaleImage;
  };

  plot.prototype.setCanvas = function(canvas) {
    this.canvas = canvas;
  };

  plot.prototype.setDomain = function(domain, render) {
    this.domain = domain;
    if (this.gl){

    }else if (this.ctx){
      this.chromaColorscale.domain(this.domain);
    }
    if(defaultFor(render,false)) this.render();
  };

  plot.prototype.setColorScale = function(colorscale) {
    this.colorscale = colorscale;
    var cs_def = colorscales[colorscale];

    if (this.gl){
      if (cs_def.colors.length !== cs_def.positions.length) {
        throw new Error("Invalid color scale.");
      }
      var gradient = this.colorscaleCanvasCtx.createLinearGradient(0, 0, 100, 1);

      for (var i = 0; i < cs_def.colors.length; ++i) {
        gradient.addColorStop(cs_def.positions[i], cs_def.colors[i]);
      }
      this.colorscaleCanvasCtx.fillStyle = gradient;
      this.colorscaleCanvasCtx.fillRect(0, 0, 100, 1);
      this.setColorscaleImage(this.colorscaleCanvas);

    }else if (this.ctx){
      this.chromaColorscale = chroma.scale( cs_def.colors, cs_def.positions);
    }

  };

  plot.prototype.setColorscaleImage = function(colorscaleImage) {
    this.colorscaleImage = colorscaleImage;

    var gl = this.gl;
    this.textureScale = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.textureScale);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, colorscaleImage);
  };

  plot.prototype.setClamp = function(clamp) {
    this.clamp = clamp;
  };

  plot.prototype.setNoDataValue = function(noDataValue) {
    this.noDataValue = noDataValue;
  };

  plot.prototype.render = function (){

  	//var t0 = performance.now();

    if (this.gl){

      var gl = this.gl;
      gl.useProgram(this.program);
      // set the images
      gl.uniform1i(gl.getUniformLocation(this.program, "u_textureData"), 0);
      gl.uniform1i(gl.getUniformLocation(this.program, "u_textureScale"), 1);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.textureData);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.textureScale);

      var positionLocation = gl.getAttribLocation(this.program, "a_position");
      var domainLocation = gl.getUniformLocation(this.program, "u_domain");
      var resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
      var textureSizeLocation = gl.getUniformLocation(this.program, "u_textureSize");
      var noDataValueLocation = gl.getUniformLocation(this.program, "u_noDataValue");
      var clampLocation = gl.getUniformLocation(this.program, "u_clamp");

      gl.uniform2f(textureSizeLocation, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2fv(domainLocation, this.domain);
      gl.uniform1i(clampLocation, this.clamp);

      var width = gl.canvas.width;
      var height = gl.canvas.height;
      var positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      setRectangle(gl, 0, 0, width, height);

      // Draw the rectangle.
      gl.drawArrays(gl.TRIANGLES, 0, 6);

    }else if (this.ctx){

      var subset = 1;

      this.width = this.canvas.width;
      this.height = this.canvas.height;

      var w_sub = Math.floor(this.width/subset);
      var h_sub = Math.floor(this.height/subset);

      this.canvas.width = w_sub;
      this.canvas.height = h_sub;

      this.imageData = this.ctx.createImageData(w_sub, h_sub);

      for (var y = 0; y < h_sub; y++) {
        for (var x = 0; x < w_sub; x++) {
        

          var i = (((y*subset))*this.width)+((x)*subset);

          // TODO: When susbetting there is a slight shift of the image 
          // there must be a good way for compensating this

          var index = ((y*w_sub)+x)*4;

          if(this.data[i]==0){
            this.imageData.data[index+0] = 0;
            this.imageData.data[index+1] = 0;
            this.imageData.data[index+2] = 0;
            this.imageData.data[index+3] = 0;
          } else{
            var c = this.chromaColorscale(this.data[i])._rgb;

            this.imageData.data[index+0] = c[0];
            this.imageData.data[index+1] = c[1];
            this.imageData.data[index+2] = c[2];
            this.imageData.data[index+3] = 255;
          }

        }
      }

      this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0

    }

  //var t1 = performance.now();
  //console.log("Render took " + (t1 - t0) + " milliseconds.")
	
  };

  plot.prototype.getColor = function getColor(val){
  	return this.colorscale(val);
  };


  return {plot: plot};
};

