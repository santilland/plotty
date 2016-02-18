

plotty = (function() {

  // Colorscale definitions
  var colorscales = {
    "viridis": new Uint8Array([68,1,84,255,68,2,86,255,69,4,87,255,69,5,89,255,70,7,90,255,70,8,92,255,70,10,93,255,70,11,94,255,71,13,96,255,71,14,97,255,71,16,99,255,71,17,100,255,71,19,101,255,72,20,103,255,72,22,104,255,72,23,105,255,72,24,106,255,72,26,108,255,72,27,109,255,72,28,110,255,72,29,111,255,72,31,112,255,72,32,113,255,72,33,115,255,72,35,116,255,72,36,117,255,72,37,118,255,72,38,119,255,72,40,120,255,72,41,121,255,71,42,122,255,71,44,122,255,71,45,123,255,71,46,124,255,71,47,125,255,70,48,126,255,70,50,126,255,70,51,127,255,70,52,128,255,69,53,129,255,69,55,129,255,69,56,130,255,68,57,131,255,68,58,131,255,68,59,132,255,67,61,132,255,67,62,133,255,66,63,133,255,66,64,134,255,66,65,134,255,65,66,135,255,65,68,135,255,64,69,136,255,64,70,136,255,63,71,136,255,63,72,137,255,62,73,137,255,62,74,137,255,62,76,138,255,61,77,138,255,61,78,138,255,60,79,138,255,60,80,139,255,59,81,139,255,59,82,139,255,58,83,139,255,58,84,140,255,57,85,140,255,57,86,140,255,56,88,140,255,56,89,140,255,55,90,140,255,55,91,141,255,54,92,141,255,54,93,141,255,53,94,141,255,53,95,141,255,52,96,141,255,52,97,141,255,51,98,141,255,51,99,141,255,50,100,142,255,50,101,142,255,49,102,142,255,49,103,142,255,49,104,142,255,48,105,142,255,48,106,142,255,47,107,142,255,47,108,142,255,46,109,142,255,46,110,142,255,46,111,142,255,45,112,142,255,45,113,142,255,44,113,142,255,44,114,142,255,44,115,142,255,43,116,142,255,43,117,142,255,42,118,142,255,42,119,142,255,42,120,142,255,41,121,142,255,41,122,142,255,41,123,142,255,40,124,142,255,40,125,142,255,39,126,142,255,39,127,142,255,39,128,142,255,38,129,142,255,38,130,142,255,38,130,142,255,37,131,142,255,37,132,142,255,37,133,142,255,36,134,142,255,36,135,142,255,35,136,142,255,35,137,142,255,35,138,141,255,34,139,141,255,34,140,141,255,34,141,141,255,33,142,141,255,33,143,141,255,33,144,141,255,33,145,140,255,32,146,140,255,32,146,140,255,32,147,140,255,31,148,140,255,31,149,139,255,31,150,139,255,31,151,139,255,31,152,139,255,31,153,138,255,31,154,138,255,30,155,138,255,30,156,137,255,30,157,137,255,31,158,137,255,31,159,136,255,31,160,136,255,31,161,136,255,31,161,135,255,31,162,135,255,32,163,134,255,32,164,134,255,33,165,133,255,33,166,133,255,34,167,133,255,34,168,132,255,35,169,131,255,36,170,131,255,37,171,130,255,37,172,130,255,38,173,129,255,39,173,129,255,40,174,128,255,41,175,127,255,42,176,127,255,44,177,126,255,45,178,125,255,46,179,124,255,47,180,124,255,49,181,123,255,50,182,122,255,52,182,121,255,53,183,121,255,55,184,120,255,56,185,119,255,58,186,118,255,59,187,117,255,61,188,116,255,63,188,115,255,64,189,114,255,66,190,113,255,68,191,112,255,70,192,111,255,72,193,110,255,74,193,109,255,76,194,108,255,78,195,107,255,80,196,106,255,82,197,105,255,84,197,104,255,86,198,103,255,88,199,101,255,90,200,100,255,92,200,99,255,94,201,98,255,96,202,96,255,99,203,95,255,101,203,94,255,103,204,92,255,105,205,91,255,108,205,90,255,110,206,88,255,112,207,87,255,115,208,86,255,117,208,84,255,119,209,83,255,122,209,81,255,124,210,80,255,127,211,78,255,129,211,77,255,132,212,75,255,134,213,73,255,137,213,72,255,139,214,70,255,142,214,69,255,144,215,67,255,147,215,65,255,149,216,64,255,152,216,62,255,155,217,60,255,157,217,59,255,160,218,57,255,162,218,55,255,165,219,54,255,168,219,52,255,170,220,50,255,173,220,48,255,176,221,47,255,178,221,45,255,181,222,43,255,184,222,41,255,186,222,40,255,189,223,38,255,192,223,37,255,194,223,35,255,197,224,33,255,200,224,32,255,202,225,31,255,205,225,29,255,208,225,28,255,210,226,27,255,213,226,26,255,216,226,25,255,218,227,25,255,221,227,24,255,223,227,24,255,226,228,24,255,229,228,25,255,231,228,25,255,234,229,26,255,236,229,27,255,239,229,28,255,241,229,29,255,244,230,30,255,246,230,32,255,248,230,33,255,251,231,35,255,253,231,37,255]),
    "inferno": new Uint8Array([0,0,4,255,1,0,5,255,1,1,6,255,1,1,8,255,2,1,10,255,2,2,12,255,2,2,14,255,3,2,16,255,4,3,18,255,4,3,20,255,5,4,23,255,6,4,25,255,7,5,27,255,8,5,29,255,9,6,31,255,10,7,34,255,11,7,36,255,12,8,38,255,13,8,41,255,14,9,43,255,16,9,45,255,17,10,48,255,18,10,50,255,20,11,52,255,21,11,55,255,22,11,57,255,24,12,60,255,25,12,62,255,27,12,65,255,28,12,67,255,30,12,69,255,31,12,72,255,33,12,74,255,35,12,76,255,36,12,79,255,38,12,81,255,40,11,83,255,41,11,85,255,43,11,87,255,45,11,89,255,47,10,91,255,49,10,92,255,50,10,94,255,52,10,95,255,54,9,97,255,56,9,98,255,57,9,99,255,59,9,100,255,61,9,101,255,62,9,102,255,64,10,103,255,66,10,104,255,68,10,104,255,69,10,105,255,71,11,106,255,73,11,106,255,74,12,107,255,76,12,107,255,77,13,108,255,79,13,108,255,81,14,108,255,82,14,109,255,84,15,109,255,85,15,109,255,87,16,110,255,89,16,110,255,90,17,110,255,92,18,110,255,93,18,110,255,95,19,110,255,97,19,110,255,98,20,110,255,100,21,110,255,101,21,110,255,103,22,110,255,105,22,110,255,106,23,110,255,108,24,110,255,109,24,110,255,111,25,110,255,113,25,110,255,114,26,110,255,116,26,110,255,117,27,110,255,119,28,109,255,120,28,109,255,122,29,109,255,124,29,109,255,125,30,109,255,127,30,108,255,128,31,108,255,130,32,108,255,132,32,107,255,133,33,107,255,135,33,107,255,136,34,106,255,138,34,106,255,140,35,105,255,141,35,105,255,143,36,105,255,144,37,104,255,146,37,104,255,147,38,103,255,149,38,103,255,151,39,102,255,152,39,102,255,154,40,101,255,155,41,100,255,157,41,100,255,159,42,99,255,160,42,99,255,162,43,98,255,163,44,97,255,165,44,96,255,166,45,96,255,168,46,95,255,169,46,94,255,171,47,94,255,173,48,93,255,174,48,92,255,176,49,91,255,177,50,90,255,179,50,90,255,180,51,89,255,182,52,88,255,183,53,87,255,185,53,86,255,186,54,85,255,188,55,84,255,189,56,83,255,191,57,82,255,192,58,81,255,193,58,80,255,195,59,79,255,196,60,78,255,198,61,77,255,199,62,76,255,200,63,75,255,202,64,74,255,203,65,73,255,204,66,72,255,206,67,71,255,207,68,70,255,208,69,69,255,210,70,68,255,211,71,67,255,212,72,66,255,213,74,65,255,215,75,63,255,216,76,62,255,217,77,61,255,218,78,60,255,219,80,59,255,221,81,58,255,222,82,56,255,223,83,55,255,224,85,54,255,225,86,53,255,226,87,52,255,227,89,51,255,228,90,49,255,229,92,48,255,230,93,47,255,231,94,46,255,232,96,45,255,233,97,43,255,234,99,42,255,235,100,41,255,235,102,40,255,236,103,38,255,237,105,37,255,238,106,36,255,239,108,35,255,239,110,33,255,240,111,32,255,241,113,31,255,241,115,29,255,242,116,28,255,243,118,27,255,243,120,25,255,244,121,24,255,245,123,23,255,245,125,21,255,246,126,20,255,246,128,19,255,247,130,18,255,247,132,16,255,248,133,15,255,248,135,14,255,248,137,12,255,249,139,11,255,249,140,10,255,249,142,9,255,250,144,8,255,250,146,7,255,250,148,7,255,251,150,6,255,251,151,6,255,251,153,6,255,251,155,6,255,251,157,7,255,252,159,7,255,252,161,8,255,252,163,9,255,252,165,10,255,252,166,12,255,252,168,13,255,252,170,15,255,252,172,17,255,252,174,18,255,252,176,20,255,252,178,22,255,252,180,24,255,251,182,26,255,251,184,29,255,251,186,31,255,251,188,33,255,251,190,35,255,250,192,38,255,250,194,40,255,250,196,42,255,250,198,45,255,249,199,47,255,249,201,50,255,249,203,53,255,248,205,55,255,248,207,58,255,247,209,61,255,247,211,64,255,246,213,67,255,246,215,70,255,245,217,73,255,245,219,76,255,244,221,79,255,244,223,83,255,244,225,86,255,243,227,90,255,243,229,93,255,242,230,97,255,242,232,101,255,242,234,105,255,241,236,109,255,241,237,113,255,241,239,117,255,241,241,121,255,242,242,125,255,242,244,130,255,243,245,134,255,243,246,138,255,244,248,142,255,245,249,146,255,246,250,150,255,248,251,154,255,249,252,157,255,250,253,161,255,252,255,164,255]),
    "rainbow": {
      colors: ['#96005A', '#0000C8', '#0019FF', '#0098FF', '#2CFF96', '#97FF00', '#FFEA00', '#FF6F00', '#FF0000'],
      positions: [0, .125, .25, 0.375, 0.5, 0.625, 0.75, 0.875, 1]
    },
    "jet": {
      colors: ['#000083', '#003CAA', '#05FFFF', '#FFFF00', '#FA0000', '#800000'],
      positions: [0, .125, 0.375, 0.625, 0.875, 1]
    },
    "hsv": {
      colors: ["#ff0000","#fdff02","#f7ff02","#00fc04","#00fc0a","#01f9ff","#0200fd","#0800fd","#ff00fb","#ff00f5","#ff0006"],
      positions: [0,0.169,0.173,0.337,0.341,0.506,0.671,0.675,0.839,0.843,1]
    },
    "hot": {
      colors: ["#000000","#e60000","#ffd200","#ffffff"],
      positions: [0,0.3,0.6,1]
    },
    "cool": {
      colors: ["#00ffff","#ff00ff"],
      positions: [0,1]
    },
    "spring": {
      colors: ["#ff00ff","#ffff00"],
      positions: [0,1]
    },
    "summer": {
      colors: ["#008066","#ffff66"],
      positions: [0,1]
    },
    "autumn": {
      colors: ["#ff0000","#ffff00"],
      positions: [0,1]
    },
    "winter": {
      colors: ["#0000ff","#00ff80"],
      positions: [0,1]
    },
    "bone": {
      colors: ["#000000","#545474","#a9c8c8","#ffffff"],
      positions: [0,0.376,0.753,1]
    },
    "copper": {
      colors: ["#000000","#ffa066","#ffc77f"],
      positions: [0,0.804,1]
    },
    "greys": {
      colors: ["#000000","#ffffff"],
      positions: [0,1]
    },
    "yignbu": {
      colors: ["#081d58","#253494","#225ea8","#1d91c0","#41b6c4","#7fcdbb","#c7e9b4","#edf8d9","#ffffd9"],
      positions: [0,0.125,0.25,0.375,0.5,0.625,0.75,0.875,1]
    },
    "greens": {
      colors: ["#00441b","#006d2c","#238b45","#41ab5d","#74c476","#a1d99b","#c7e9c0","#e5f5e0","#f7fcf5"],
      positions: [0,0.125,0.25,0.375,0.5,0.625,0.75,0.875,1]
    },
    "yiorrd": {
      colors: ["#800026","#bd0026","#e31a1c","#fc4e2a","#fd8d3c","#feb24c","#fed976","#ffeda0","#ffffcc"],
      positions: [0,0.125,0.25,0.375,0.5,0.625,0.75,0.875,1]
    },
    "bluered": {
      colors: ["#0000ff","#ff0000"],
      positions: [0,1]
    },
    "rdbu": {
      colors: ["#050aac","#6a89f7","#bebebe","#dcaa84","#e6915a","#b20a1c"],
      positions: [0,0.35,0.5,0.6,0.7,1]
    },
    "picnic": {
      colors: ["#0000ff","#3399ff","#66ccff","#99ccff","#ccccff","#ffffff","#ffccff","#ff99ff","#ff66cc","#ff6666","#ff0000"],
      positions: [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]
    },
    "portland": {
      colors: ["#0c3383","#0a88ba","#f2d338","#f28f38","#d91e1e"],
      positions: [0,0.25,0.5,0.75,1]
    },
    "blackbody": {
      colors: ["#000000","#e60000","#e6d200","#ffffff","#a0c8ff"],
      positions: [0,0.2,0.4,0.7,1]
    },
    "earth": {
      colors: ["#000082","#00b4b4","#28d228","#e6e632","#784614","#ffffff"],
      positions: [0,0.1,0.2,0.4,0.6,1]
    },
    "electric": {
      colors: ["#000000","#1e0064","#780064","#a05a00","#e6c800","#fffadc"],
      positions: [0,0.15,0.4,0.6,0.8,1]
    },
    "magma": new Uint8Array([0,0,4,255,1,0,5,255,1,1,6,255,1,1,8,255,2,1,9,255,2,2,11,255,2,2,13,255,3,3,15,255,3,3,18,255,4,4,20,255,5,4,22,255,6,5,24,255,6,5,26,255,7,6,28,255,8,7,30,255,9,7,32,255,10,8,34,255,11,9,36,255,12,9,38,255,13,10,41,255,14,11,43,255,16,11,45,255,17,12,47,255,18,13,49,255,19,13,52,255,20,14,54,255,21,14,56,255,22,15,59,255,24,15,61,255,25,16,63,255,26,16,66,255,28,16,68,255,29,17,71,255,30,17,73,255,32,17,75,255,33,17,78,255,34,17,80,255,36,18,83,255,37,18,85,255,39,18,88,255,41,17,90,255,42,17,92,255,44,17,95,255,45,17,97,255,47,17,99,255,49,17,101,255,51,16,103,255,52,16,105,255,54,16,107,255,56,16,108,255,57,15,110,255,59,15,112,255,61,15,113,255,63,15,114,255,64,15,116,255,66,15,117,255,68,15,118,255,69,16,119,255,71,16,120,255,73,16,120,255,74,16,121,255,76,17,122,255,78,17,123,255,79,18,123,255,81,18,124,255,82,19,124,255,84,19,125,255,86,20,125,255,87,21,126,255,89,21,126,255,90,22,126,255,92,22,127,255,93,23,127,255,95,24,127,255,96,24,128,255,98,25,128,255,100,26,128,255,101,26,128,255,103,27,128,255,104,28,129,255,106,28,129,255,107,29,129,255,109,29,129,255,110,30,129,255,112,31,129,255,114,31,129,255,115,32,129,255,117,33,129,255,118,33,129,255,120,34,129,255,121,34,130,255,123,35,130,255,124,35,130,255,126,36,130,255,128,37,130,255,129,37,129,255,131,38,129,255,132,38,129,255,134,39,129,255,136,39,129,255,137,40,129,255,139,41,129,255,140,41,129,255,142,42,129,255,144,42,129,255,145,43,129,255,147,43,128,255,148,44,128,255,150,44,128,255,152,45,128,255,153,45,128,255,155,46,127,255,156,46,127,255,158,47,127,255,160,47,127,255,161,48,126,255,163,48,126,255,165,49,126,255,166,49,125,255,168,50,125,255,170,51,125,255,171,51,124,255,173,52,124,255,174,52,123,255,176,53,123,255,178,53,123,255,179,54,122,255,181,54,122,255,183,55,121,255,184,55,121,255,186,56,120,255,188,57,120,255,189,57,119,255,191,58,119,255,192,58,118,255,194,59,117,255,196,60,117,255,197,60,116,255,199,61,115,255,200,62,115,255,202,62,114,255,204,63,113,255,205,64,113,255,207,64,112,255,208,65,111,255,210,66,111,255,211,67,110,255,213,68,109,255,214,69,108,255,216,69,108,255,217,70,107,255,219,71,106,255,220,72,105,255,222,73,104,255,223,74,104,255,224,76,103,255,226,77,102,255,227,78,101,255,228,79,100,255,229,80,100,255,231,82,99,255,232,83,98,255,233,84,98,255,234,86,97,255,235,87,96,255,236,88,96,255,237,90,95,255,238,91,94,255,239,93,94,255,240,95,94,255,241,96,93,255,242,98,93,255,242,100,92,255,243,101,92,255,244,103,92,255,244,105,92,255,245,107,92,255,246,108,92,255,246,110,92,255,247,112,92,255,247,114,92,255,248,116,92,255,248,118,92,255,249,120,93,255,249,121,93,255,249,123,93,255,250,125,94,255,250,127,94,255,250,129,95,255,251,131,95,255,251,133,96,255,251,135,97,255,252,137,97,255,252,138,98,255,252,140,99,255,252,142,100,255,252,144,101,255,253,146,102,255,253,148,103,255,253,150,104,255,253,152,105,255,253,154,106,255,253,155,107,255,254,157,108,255,254,159,109,255,254,161,110,255,254,163,111,255,254,165,113,255,254,167,114,255,254,169,115,255,254,170,116,255,254,172,118,255,254,174,119,255,254,176,120,255,254,178,122,255,254,180,123,255,254,182,124,255,254,183,126,255,254,185,127,255,254,187,129,255,254,189,130,255,254,191,132,255,254,193,133,255,254,194,135,255,254,196,136,255,254,198,138,255,254,200,140,255,254,202,141,255,254,204,143,255,254,205,144,255,254,207,146,255,254,209,148,255,254,211,149,255,254,213,151,255,254,215,153,255,254,216,154,255,253,218,156,255,253,220,158,255,253,222,160,255,253,224,161,255,253,226,163,255,253,227,165,255,253,229,167,255,253,231,169,255,253,233,170,255,253,235,172,255,252,236,174,255,252,238,176,255,252,240,178,255,252,242,180,255,252,244,182,255,252,246,184,255,252,247,185,255,252,249,187,255,252,251,189,255,252,253,191,255]),
    "plasma": new Uint8Array([13,8,135,255,16,7,136,255,19,7,137,255,22,7,138,255,25,6,140,255,27,6,141,255,29,6,142,255,32,6,143,255,34,6,144,255,36,6,145,255,38,5,145,255,40,5,146,255,42,5,147,255,44,5,148,255,46,5,149,255,47,5,150,255,49,5,151,255,51,5,151,255,53,4,152,255,55,4,153,255,56,4,154,255,58,4,154,255,60,4,155,255,62,4,156,255,63,4,156,255,65,4,157,255,67,3,158,255,68,3,158,255,70,3,159,255,72,3,159,255,73,3,160,255,75,3,161,255,76,2,161,255,78,2,162,255,80,2,162,255,81,2,163,255,83,2,163,255,85,2,164,255,86,1,164,255,88,1,164,255,89,1,165,255,91,1,165,255,92,1,166,255,94,1,166,255,96,1,166,255,97,0,167,255,99,0,167,255,100,0,167,255,102,0,167,255,103,0,168,255,105,0,168,255,106,0,168,255,108,0,168,255,110,0,168,255,111,0,168,255,113,0,168,255,114,1,168,255,116,1,168,255,117,1,168,255,119,1,168,255,120,1,168,255,122,2,168,255,123,2,168,255,125,3,168,255,126,3,168,255,128,4,168,255,129,4,167,255,131,5,167,255,132,5,167,255,134,6,166,255,135,7,166,255,136,8,166,255,138,9,165,255,139,10,165,255,141,11,165,255,142,12,164,255,143,13,164,255,145,14,163,255,146,15,163,255,148,16,162,255,149,17,161,255,150,19,161,255,152,20,160,255,153,21,159,255,154,22,159,255,156,23,158,255,157,24,157,255,158,25,157,255,160,26,156,255,161,27,155,255,162,29,154,255,163,30,154,255,165,31,153,255,166,32,152,255,167,33,151,255,168,34,150,255,170,35,149,255,171,36,148,255,172,38,148,255,173,39,147,255,174,40,146,255,176,41,145,255,177,42,144,255,178,43,143,255,179,44,142,255,180,46,141,255,181,47,140,255,182,48,139,255,183,49,138,255,184,50,137,255,186,51,136,255,187,52,136,255,188,53,135,255,189,55,134,255,190,56,133,255,191,57,132,255,192,58,131,255,193,59,130,255,194,60,129,255,195,61,128,255,196,62,127,255,197,64,126,255,198,65,125,255,199,66,124,255,200,67,123,255,201,68,122,255,202,69,122,255,203,70,121,255,204,71,120,255,204,73,119,255,205,74,118,255,206,75,117,255,207,76,116,255,208,77,115,255,209,78,114,255,210,79,113,255,211,81,113,255,212,82,112,255,213,83,111,255,213,84,110,255,214,85,109,255,215,86,108,255,216,87,107,255,217,88,106,255,218,90,106,255,218,91,105,255,219,92,104,255,220,93,103,255,221,94,102,255,222,95,101,255,222,97,100,255,223,98,99,255,224,99,99,255,225,100,98,255,226,101,97,255,226,102,96,255,227,104,95,255,228,105,94,255,229,106,93,255,229,107,93,255,230,108,92,255,231,110,91,255,231,111,90,255,232,112,89,255,233,113,88,255,233,114,87,255,234,116,87,255,235,117,86,255,235,118,85,255,236,119,84,255,237,121,83,255,237,122,82,255,238,123,81,255,239,124,81,255,239,126,80,255,240,127,79,255,240,128,78,255,241,129,77,255,241,131,76,255,242,132,75,255,243,133,75,255,243,135,74,255,244,136,73,255,244,137,72,255,245,139,71,255,245,140,70,255,246,141,69,255,246,143,68,255,247,144,68,255,247,145,67,255,247,147,66,255,248,148,65,255,248,149,64,255,249,151,63,255,249,152,62,255,249,154,62,255,250,155,61,255,250,156,60,255,250,158,59,255,251,159,58,255,251,161,57,255,251,162,56,255,252,163,56,255,252,165,55,255,252,166,54,255,252,168,53,255,252,169,52,255,253,171,51,255,253,172,51,255,253,174,50,255,253,175,49,255,253,177,48,255,253,178,47,255,253,180,47,255,253,181,46,255,254,183,45,255,254,184,44,255,254,186,44,255,254,187,43,255,254,189,42,255,254,190,42,255,254,192,41,255,253,194,41,255,253,195,40,255,253,197,39,255,253,198,39,255,253,200,39,255,253,202,38,255,253,203,38,255,252,205,37,255,252,206,37,255,252,208,37,255,252,210,37,255,251,211,36,255,251,213,36,255,251,215,36,255,250,216,36,255,250,218,36,255,249,220,36,255,249,221,37,255,248,223,37,255,248,225,37,255,247,226,37,255,247,228,37,255,246,230,38,255,246,232,38,255,245,233,38,255,245,235,39,255,244,237,39,255,243,238,39,255,243,240,39,255,242,242,39,255,241,244,38,255,241,245,37,255,240,247,36,255,240,249,33,255])
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

  function hasOwnProperty(obj, prop) {
      var proto = obj.__proto__ || obj.constructor.prototype;
      return (prop in obj) &&
          (!(prop in proto) || proto[prop] !== obj[prop]);
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
    'uniform bool u_clampLow;\n'+
    'uniform bool u_clampHigh;\n'+

    '// the texCoords passed in from the vertex shader.\n'+
    'varying vec2 v_texCoord;\n'+

    'void main() {\n'+
      'vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\n'+
      'float value = texture2D(u_textureData, v_texCoord)[0];\n'+
      'if (value == u_noDataValue)\n'+
        'gl_FragColor = vec4(0.0, 0, 0, 0.0);\n'+
      'else if ((!u_clampLow && value < u_domain[0]) || (!u_clampHigh && value > u_domain[1]))\n'+
        'gl_FragColor = vec4(0, 0, 0, 0);\n'+
      'else {\n'+
        'float normalisedValue = (value - u_domain[0]) / (u_domain[1] - u_domain[0]);\n'+
        'gl_FragColor = texture2D(u_textureScale, vec2(normalisedValue, 0));\n'+
      '}\n'+
    '}';
	
	
  // plot constructor
  var plot = function (canvas, data, width, height, domain, colorscale, clamp, mouseover) {

    this.datasetCollection = {};
    
    this.setCanvas(canvas);

    // Apart from canvas all other options are optional to allow creating a base object
    // to which multiple datasets can be added and rendered.
    data = defaultFor(data, false);

    // TODO: Considering saving dimensions directly in object
    // testing by overriding dimensions given, what is the best way
    // to provide both functionalities?
    if (data){
      var l = data.length;
      canvas.width = defaultFor(width, data[l-2]);
      canvas.height = defaultFor(height, data[l-2]);
    }
    
    // Check if we can create webgl context and have supported float textures
    gl = this.gl = create3DContext(canvas);
    if(!gl)
      this.ctx = canvas.getContext("2d");

    // Create single canvas to render colorscales
    this.colorscaleCanvas = document.createElement('canvas');
    this.colorscaleCanvas.width = 100;
    this.colorscaleCanvas.height = 1;
    this.colorscaleCanvasCtx = this.colorscaleCanvas.getContext("2d");

    this.setClamp(defaultFor(clamp, true));

    if (data){
      this.setData(data,canvas.width, canvas.height);
    }
    
    if(gl){

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

    }
    
    this.setColorScale(defaultFor(colorscale, 'viridis'));
    this.setDomain(defaultFor(domain, [0,1]));

    this.imageData = null;


    var self = this;

    function mouseovervalue(e) {
      var pos = getMousePos(self.canvas, e);
      callback_value(self.data[(pos.y*canvas.width)+pos.x]);
    }
    //this.canvas.addEventListener('mousemove', mouseovervalue, false);
  };

  plot.prototype.getData = function() {
    return this.data;
  };

  plot.prototype.setData = function(data, width, height) {
    var canvas = this.canvas;
    canvas.width = width;
    canvas.height = height;

    if (this.gl){
      var gl = this.gl;
      gl.viewport(0, 0, canvas.width, canvas.height);
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
  };

  plot.prototype.addDataset = function(id, data, width, height) {
    
    if (this.gl){
      var gl = this.gl;
      gl.viewport(0, 0, width, height);
      var textureData = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, textureData);

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
      this.datasetCollection[id] = {textureData: textureData, width:width, height:height};
    }

  };

  plot.prototype.removeDataset = function(id) {
    
    if (this.gl){
      this.gl.deleteTexture(this.datasetCollection[id].textureData);
      delete this.datasetCollection[id];
    }

  };

  plot.prototype.datasetAvailable = function(id) {
    
    if (this.gl){
      return hasOwnProperty(this.datasetCollection, id);
    }
    return false;

  };

  plot.prototype.getScaleImage = function() {
    return this.colorscaleImage;
  };

  plot.prototype.setCanvas = function(canvas) {
    this.canvas = canvas;
  };

  plot.prototype.setDomain = function(domain, render) {
    this.domain = domain;
    if(defaultFor(render,false)) this.render();
  };

  var addColorScale = function(name, colors, positions){
    if (colors.length !== positions.length) {
      throw new Error("Invalid color scale.");
    }
    colorscales[name] = {
      colors: colors,
      positions: positions
    };
  };

  var renderColorScaleToCanvas = function(colorscale, canvas){
    var cs_def = this.colorscales[colorscale];
    canvas.height = 1;
    var canvas_ctx = canvas.getContext("2d");

    if (Object.prototype.toString.call(cs_def) === "[object Object]") {
      canvas.width = 100;
      var gradient = canvas_ctx.createLinearGradient(0, 0, 100, 1);

      for (var i = 0; i < cs_def.colors.length; ++i) {
        gradient.addColorStop(cs_def.positions[i], cs_def.colors[i]);
      }
      canvas_ctx.fillStyle = gradient;
      canvas_ctx.fillRect(0, 0, 100, 1);
      
    }
    else if (Object.prototype.toString.call(cs_def) === "[object Uint8Array]") {
      canvas.width = 256;
      var imgData = canvas_ctx.createImageData(256,1);
      imgData.data.set(cs_def);
      canvas_ctx.putImageData(imgData,0,0);

    }else{
      throw new Error("Color scale not defined.");
    }
  }

  plot.prototype.setColorScale = function(colorscale) {
    
    this.colorscale = colorscale;
    var cs_def = colorscales[colorscale];

    if (Object.prototype.toString.call(cs_def) === "[object Object]") {
      this.colorscaleCanvas.width = 100;
      var gradient = this.colorscaleCanvasCtx.createLinearGradient(0, 0, 100, 1);

      for (var i = 0; i < cs_def.colors.length; ++i) {
        gradient.addColorStop(cs_def.positions[i], cs_def.colors[i]);
      }
      this.colorscaleCanvasCtx.fillStyle = gradient;
      this.colorscaleCanvasCtx.fillRect(0, 0, 100, 1);
      
    }
    else if (Object.prototype.toString.call(cs_def) === "[object Uint8Array]") {
      this.colorscaleCanvas.height = 1;
      this.colorscaleCanvas.width = 256;
      var imgData = this.colorscaleCanvasCtx.createImageData(256,1);
      imgData.data.set(cs_def);
      this.colorscaleCanvasCtx.putImageData(imgData,0,0);

    }else{
      throw new Error("Color scale not defined.");
    }

    if(this.gl)
      this.setColorscaleImage(this.colorscaleCanvas);
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

  plot.prototype.setClamp = function(clampLow, clampHigh) {
    this.clampLow = clampLow;
    this.clampHigh = (typeof clampHigh !== "undefined") ? clampHigh : clampLow;
  };

  plot.prototype.setNoDataValue = function(noDataValue) {
    this.noDataValue = noDataValue;
  };

  plot.prototype.render = function (){
    var canvas = this.canvas;
    if (this.gl) {
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
      var noDataValueLocation = gl.getUniformLocation(this.program, "u_noDataValue");
      var clampLowLocation = gl.getUniformLocation(this.program, "u_clampLow");
      var clampHighLocation = gl.getUniformLocation(this.program, "u_clampHigh");

      gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
      gl.uniform2fv(domainLocation, this.domain);
      gl.uniform1i(clampLowLocation, this.clampLow);
      gl.uniform1i(clampHighLocation, this.clampHigh);
      gl.uniform1f(noDataValueLocation, this.noDataValue);

      var positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      setRectangle(gl, 0, 0, canvas.width, canvas.height);

      // Draw the rectangle.
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    else if (this.ctx) {
      var w = canvas.width;
      var h = canvas.height;

      this.imageData = this.ctx.createImageData(w, h);

      var trange = this.domain[1] - this.domain[0];
      var steps = this.colorscaleCanvas.width;
      var csImageData = this.colorscaleCanvasCtx.getImageData(0, 0, steps, 1).data;
      var alpha;

      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {

          var i = (y*w)+x;
          // TODO: Possible increase of performance through use of worker threads?

          var index = ((y*w)+x)*4;

          if (this.data[i] == this.noDataValue) {
            this.imageData.data[index+0] = 0;
            this.imageData.data[index+1] = 0;
            this.imageData.data[index+2] = 0;
            this.imageData.data[index+3] = 0;
          }
          else {
            var c = Math.round(((this.data[i] - this.domain[0]) / trange) * steps);
            alpha = 255;
            if (c < 0) {
              c = 0;
              if (!this.clampLow) {
                alpha = 0;
              }
            } 
            if (c > 255) {
              c = 255;
              if (!this.clampHigh) {
                alpha = 0;
              }
            }

            this.imageData.data[index+0] = csImageData[c*4];
            this.imageData.data[index+1] = csImageData[c*4+1];
            this.imageData.data[index+2] = csImageData[c*4+2];
            this.imageData.data[index+3] = alpha;
          }
        }
      }

      this.ctx.putImageData(this.imageData, 0, 0); // at coords 0,0
    }
	
  };

  plot.prototype.renderDataset = function (id){
    var ds = this.datasetCollection[id];

    var canvas = this.canvas;
    canvas.width = ds.width;
    canvas.height = ds.height;

    if (this.gl){

      var gl = this.gl;
      gl.viewport(0, 0, ds.width, ds.height);
      gl.useProgram(this.program);
      // set the images
      gl.uniform1i(gl.getUniformLocation(this.program, "u_textureData"), 0);
      gl.uniform1i(gl.getUniformLocation(this.program, "u_textureScale"), 1);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, ds.textureData);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.textureScale);

      var positionLocation = gl.getAttribLocation(this.program, "a_position");
      var domainLocation = gl.getUniformLocation(this.program, "u_domain");
      var resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
      //var textureSizeLocation = gl.getUniformLocation(this.program, "u_textureSize");
      var noDataValueLocation = gl.getUniformLocation(this.program, "u_noDataValue");
      var clampLowLocation = gl.getUniformLocation(this.program, "u_clampLow");
      var clampHighLocation = gl.getUniformLocation(this.program, "u_clampHigh");

      //gl.uniform2f(textureSizeLocation, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2fv(domainLocation, this.domain);
      gl.uniform1i(clampLowLocation, this.clampLow);
      gl.uniform1i(clampHighLocation, this.clampHigh);
      gl.uniform1f(noDataValueLocation, this.noDataValue);

      var positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      setRectangle(gl, 0, 0, canvas.width, canvas.height);

      // Draw the rectangle.
      gl.drawArrays(gl.TRIANGLES, 0, 6);

    }
  
  };

  plot.prototype.getColor = function getColor(val){
  	return this.colorscale(val);
  };


  return {
    plot: plot, addColorScale: addColorScale, colorscales: colorscales,
    renderColorScaleToCanvas: renderColorScaleToCanvas
  };
})();