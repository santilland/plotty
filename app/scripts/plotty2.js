plotty2 = new function() {

  var vertexShaderSource = `attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;
varying vec2 v_texCoord;
void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
   vec2 zeroToOne = a_position / u_resolution;
   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;
   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;
   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   v_texCoord = a_texCoord;
}`;

  var fragmentShaderSource = `
precision mediump float;

// our textur
uniform sampler2D u_textureData;
uniform sampler2D u_textureScale;
uniform vec2 u_textureSize;
uniform vec2 u_domain;
uniform float u_noDataValue;
uniform bool u_clamp;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
  vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
  float value = texture2D(u_textureData, v_texCoord)[0];
  if (value == u_noDataValue)
    gl_FragColor = vec4(0, 0, 0, 0);
  else if (!u_clamp && (value < u_domain[0] || value > u_domain[1]))
    gl_FragColor = vec4(0, 0, 0, 0);
  else {
    float normalisedValue = (value - u_domain[0]) / (u_domain[1] - u_domain[0]);
    gl_FragColor = texture2D(u_textureScale, vec2(normalisedValue, 0));
  }
}`;

  var plot = function(canvas, data, width, height, scaleImage, domain) {
    var gl = this.gl = create3DContext(canvas);
    if (!gl || !gl.getExtension('OES_texture_float')) {
      throw new Error("The Browser does not support WebGL or the float texture.");
    }

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

    this.setData(data, width, height);
    this.setDomain(domain);
    this.setScaleImage(scaleImage);
    this.setClamp(false);
  }

  plot.prototype.setData = function(data, width, height) {
    var gl = this.gl;
    this.data = data;
    this.width = width;
    this.height = height;

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
      gl.LUMINANCE, gl.FLOAT, new Float32Array(data));
  }

  plot.prototype.setScale = function(colors, stops) {
    // scale must be a chroma-js scale
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = 1;

    if (colors.length !== stops.length) {
      throw new Error("Invalid color scale.");
    }

    var gradient = ctx.createLinearGradient(0, 0, 100, 1);

    for (var i = 0; i < colors.length; ++i) {
      gradient.addColorStop(stops[i], colors[i]);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 1);
    this.setScaleImage(canvas);
  };

  plot.prototype.setScaleImage = function(scaleImage) {
    this.scaleImage = scaleImage;

    var gl = this.gl;
    this.textureScale = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.textureScale);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, scaleImage);
  };

  plot.prototype.getData = function() {
    return this.data;
  };

  plot.prototype.getScaleImage = function() {
    return this.scaleImage;
  };

  plot.prototype.setDomain = function(domain) {
    this.domain = domain;
  };

  plot.prototype.setClamp = function(clamp) {
    this.clamp = clamp;
  };

  plot.prototype.setNoDataValue = function(noDataValue) {
    this.noDataValue = noDataValue;
  };

  /*
  The main rendering method. Renders the set data with the previously entered
  values.
  */
  plot.prototype.render = function() {
    var gl = this.gl;
    /*gl.canvas.width = this.width;
    gl.canvas.height = this.height;*/
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
  };

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
    return context;
  }

  return {plot: plot};
};
