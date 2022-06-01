const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext("webgl")
const vertexData = [
    0, 0.5, 0,
    0.5, -0.5, 0,
    -0.5, -0.5, 0,
];
// making buffers
// don't actually think this is needed
// nvm, it's needed for the vertexData
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
void main(){ 
    gl_Position = vec4(position, 1);
}
`);
gl.compileShader(vertexShader);
// catching erros with compilation of fragment shaders
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
   console.error('ERRO compiling vertex shader' , gl.getShaderInfoLog(vertexShader));
}


const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

void main(){
    gl_FragColor = vec4(0, 0, 1, 1);
}
`);
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


const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// making the background color
gl.clearColor(0.75, 0.85, 0.8, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);

