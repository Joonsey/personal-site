const canvas = document.querySelector('canvas')

function scaleCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

//window.onresize = scaleCanvas;

//scaleCanvas();
canvas.width = 1920;
canvas.height = 1000;

const gl = canvas.getContext("webgl")
const vertexData = [
// X, Y, Z, R, G, B
    0, 0.5, 0, 0.7, 0, 0,
    0.5, -0.5, 0, 0, 0.6, 0,
    -0.5, -0.5, 0, 0, 0, 0.8
];
// making buffers
// don't actually think this is needed
// nvm, it's needed for the vertexData
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.DYNAMIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 fragColor;
void main(){ 
    fragColor = color;
    gl_Position = vec4(position, 1);
}
`);
// fragColor attribute becomes the color attribute every time


gl.compileShader(vertexShader);
// catching erros with compilation of fragment shaders
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
   console.error('ERRO compiling vertex shader' , gl.getShaderInfoLog(vertexShader));
}


const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 fragColor;
void main(){
    gl_FragColor = vec4(fragColor, 1);
}
`);
// fragcolor attribute determines the FragColor every time


gl.compileShader(fragmentShader);
// catching errors with compilation of fragment shaders
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
   console.error('ERRO compiling fragment shader' , gl.getShaderInfoLog(fragmentShader));
}

// making and compiling program
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	console.error('ERRO linking program', gl.getProgramInfoLog(program))
}
// DEBUG ONLY
gl.validateProgram(program);
if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
	console.error('ERROR validating program', gl.getProgramInfoLog(program))
}


const positionLocation = gl.getAttribLocation(program, "position");
const colorLocation = gl.getAttribLocation(program, "color");
gl.enableVertexAttribArray(positionLocation);
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer( 
    positionLocation, // attribute location
    3, // number of elements per attribute
    gl.FLOAT, // type of element 
    false, // normalized?
    6 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    0 // offset from the beginning of a single vertex to this attribute
);
gl.vertexAttribPointer(
    colorLocation, // attribute location
    3, // number of elements per attribute
    gl.FLOAT, // type of element 
    false, // normalized?
    6 * Float32Array.BYTES_PER_ELEMENT, // size of an individual vertex
    3 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute
);

// making the background color
gl.clearColor(0.05, 0.05, 0.08, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);

