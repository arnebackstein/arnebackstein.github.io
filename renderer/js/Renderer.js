import {Matrix} from "./Matrix.js";
import {Vector} from "./Vector.js";

export class Renderer {

    static vertexShader = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec4 aVertexColor;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    varying lowp vec4 vColor;
    varying vec3 vNormal;
    
    void main(void) {
      vNormal = aVertexNormal;
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

    static fragmentShader = `
    precision mediump float;
    varying lowp vec4 vColor;
    varying vec3 vNormal;
    
    uniform vec3 uReverseLightDirection;
    uniform float uRenderWithLighting;
    
    void main(void) {
      vec3 normal = normalize(vNormal);
      
      float light = dot(normal, uReverseLightDirection);
    
      gl_FragColor = vColor;
      
      if(uRenderWithLighting == 1.){
          vec3 ambientLight = gl_FragColor.rgb * vec3(0.5,0.5,0.5);
          gl_FragColor.rgb *= light + vec3(0.1,0.1,0.1);
      }
    }
    `;

    constructor(props) {
        this.canvas = props.canvasElement;
        this.gl = this.getGLContext();
        if(!this.gl) return;

        this.shader = this.initializeShaderProgram();

        this.uniformLocations = {
                projectionMatrix: this.gl.getUniformLocation(this.shader,"uProjectionMatrix"),
                modelViewMatrix: this.gl.getUniformLocation(this.shader, "uModelViewMatrix"),
                reverseLightDirection: this.gl.getUniformLocation(this.shader, "uReverseLightDirection"),
                renderWithLighting: this.gl.getUniformLocation(this.shader, "uRenderWithLighting"),
        };

        this.positions = props.positions;
        this.positionsBuffer = this.createArrayBuffer(new Float32Array(this.positions),"aVertexPosition", 3);

        this.normals = props.normals;
        this.normalsBuffer = this.createArrayBuffer(new Float32Array(this.normals),"aVertexNormal", 3);

        this.colors = props.colors;
        this.colorsBuffer = this.createArrayBuffer(new Float32Array(this.colors),"aVertexColor", 4);

        this.indices = props.indices;
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

        this.renderWithLighting = true;

        this.rotation = 0.0;
        this.rotationZ = 0.0;

        this.mouseDownX = 0.0;
        this.mouseDownY = 0.0;

        this.initOrbitControls();

        this.then = 0;
        requestAnimationFrame(this.render);
    }

    initOrbitControls(){
        const MAX_ROT = 45. * Math.PI / 180. // prevent rotating across the poles
        const MAX_ROT_Z = 2 * Math.PI

        const mouseMove = (event) => {

            let diffX = this.mouseDownX - event.clientX;
            let diffY = this.mouseDownY - event.clientY;
            this.mouseDownX = event.clientX;
            this.mouseDownY = event.clientY;
            this.rotation += diffY*0.01;
            this.rotationZ += diffX*0.01;
            this.rotationZ %= MAX_ROT_Z;

            this.rotation = Math.min(MAX_ROT,Math.max(-MAX_ROT, this.rotation));
        }

        this.canvas.addEventListener("mousedown", (event) => {
            this.mouseDownX = event.clientX;
            this.mouseDownY = event.clientY;
            this.canvas.addEventListener("mouseup", (e) => {
                this.canvas.removeEventListener("mousemove", mouseMove);
            });
            this.canvas.addEventListener("mousemove", mouseMove);
        });

    }

    render = (now) => {
        now *= 0.001;
        const deltaTime = now - this.then;
        this.then = now;

        this.drawScene(deltaTime);

        requestAnimationFrame(this.render);
    }

    getGLContext(){
        let gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        if(!gl) alert("Could not initialize WebGL, please update your Browser.");
        return gl;
    }

    loadShader(type, source){
        const shader = this.gl.createShader(type);

        // Send the source to the shader object

        this.gl.shaderSource(shader, source);

        // Compile the shader program

        this.gl.compileShader(shader);

        // See if it compiled successfully

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(
                "An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader)
            );
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    initializeShaderProgram() {
        const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, Renderer.vertexShader);
        const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, Renderer.fragmentShader);

        // Create the shader program

        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            alert(
                "Unable to initialize the shader program: " +
                this.gl.getProgramInfoLog(shaderProgram)
            );
            return null;
        }

        return shaderProgram;
    }

    createArrayBuffer(data, attributeName, numOfComponents){
        const attributeLocation = this.gl.getAttribLocation(this.shader, attributeName);

        const bufferId = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferId);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        this.gl.vertexAttribPointer(
            attributeLocation,
            numOfComponents,
            this.gl.FLOAT,
            false,
            0,
            0
        );
        this.gl.enableVertexAttribArray(attributeLocation);

        return bufferId;
    }

    setColors(colors){
        this.colors = colors;
        this.colorsBuffer = this.createArrayBuffer(new Float32Array(this.colors),"aVertexColor", 4);
    }

    setPositions(positions){
        this.positions = positions;
        this.colorsBuffer = this.createArrayBuffer(new Float32Array(this.positions),"aVertexPosition", 3);
    }

    setNormals(normals){
        this.normals = normals;
        this.colorsBuffer = this.createArrayBuffer(new Float32Array(this.normals),"aVertexNormal", 3);
    }

    getProjectionMatrix(){
        const fieldOfView = (45 * Math.PI) / 180; // in radians
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;

        const f = 1.0 / Math.tan(fieldOfView / 2);
        const nf = 1 / (zNear - zFar);

        let projectionMatrix = [
            f / aspect,0, 0, 0,
            0, f, 0, 0,
            0, 0, (zFar + zNear) * nf, -1,
            0, 0, 2 * zFar * zNear * nf , 0,
        ];

        return new Float32Array(projectionMatrix);
    }

    getModelViewMatrix(){
        const modelViewMatrix = new Matrix();

        // translate to make the full object visible
        modelViewMatrix.translate(0.0,0.0,-7.0);

        // rotate for orbital controls
        modelViewMatrix.rotate(this.rotation, [1,0,0]);
        modelViewMatrix.rotate(this.rotationZ, [0,1,0]);

        return modelViewMatrix.mat;
    }

    clearCanvas(){
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        this.gl.clearDepth(1.0); // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
        // Clear the canvas before we start drawing on it.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    setUniforms(){
        this.gl.uniformMatrix4fv(
            this.uniformLocations.projectionMatrix,
            false,
            this.getProjectionMatrix()
        );
        this.gl.uniformMatrix4fv(
            this.uniformLocations.modelViewMatrix,
            false,
            this.getModelViewMatrix()
        );


        const reverseLightVec = new Vector(0.5, 0.7, 1);
        this.gl.uniform3fv(
            this.uniformLocations.reverseLightDirection,
            reverseLightVec.normalized().getPosition()
        );


        this.gl.uniform1fv(
            this.uniformLocations.renderWithLighting,
            new Float32Array([
                this.renderWithLighting ? 1. : 0
            ])
        );
    }

    drawScene(deltaTime) {
        this.clearCanvas();

        this.gl.useProgram(this.shader);

        this.setUniforms();

        const vertexCount = this.positions.length / 3; // each position has 3 values
        this.gl.drawElements(this.gl.TRIANGLES, vertexCount, this.gl.UNSIGNED_SHORT, 0);
    }
}