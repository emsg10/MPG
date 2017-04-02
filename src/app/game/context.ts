import { Observable, Subscription, Observer } from 'rxjs';
import { ShaderType, Asset } from './model';

export class Context
{
	public shaderProgram: WebGLProgram;
	public particleProgram: WebGLProgram;
	public simpleParticleProgram: WebGLProgram;
	public dynamicVertecyProgram: WebGLProgram;
	public gl: WebGLRenderingContext;
	public glTexture: WebGLTexture;
	public frostParticelTexture: WebGLTexture;
	public genericParticleTexture: WebGLTexture;

	constructor(asset: Asset, width: number, height: number, canvas: HTMLCanvasElement){
		this.initContext(width, height, canvas);
		this.initShaders(asset);
	}

	public clear(color: number[]) {
		this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
		this.gl.clearColor(color[0], color[1], color[2], color[3]);
	}

	private initContext(width: number, height: number, canvas: HTMLCanvasElement) {
		canvas.width = width;
		canvas.height = height;
		this.gl = canvas.getContext("experimental-webgl");

		console.log("Context initialized...");
	}

	private initShaders(asset: Asset) {
		let vertexShader = this.compileShader(asset.vertexShader, ShaderType.Vertex);
		let fragmentShader = this.compileShader(asset.fragmentShader, ShaderType.Fragment);

		let particleVertexShader = this.compileShader(asset.particleVertexShader, ShaderType.Vertex);
		let particleFragmentShader = this.compileShader(asset.particleFragmentShader, ShaderType.Fragment);

		let simpleParticleVertexShader = this.compileShader(asset.simpleParticleVertexShader, ShaderType.Vertex);
		let simpleParticleFragmentShader = this.compileShader(asset.simpleParticleFragmentShader, ShaderType.Fragment);

		let dynamicVertexShader = this.compileShader(asset.dynamicVertexShader, ShaderType.Vertex);
		let dynamicFragmentShader = this.compileShader(asset.dynamicFragmentShader, ShaderType.Fragment);

		this.dynamicVertecyProgram = this.gl.createProgram();
		this.gl.attachShader(this.dynamicVertecyProgram, dynamicVertexShader);
		this.gl.attachShader(this.dynamicVertecyProgram, dynamicFragmentShader);
		this.gl.linkProgram(this.dynamicVertecyProgram);
		if (!this.gl.getProgramParameter(this.dynamicVertecyProgram, this.gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.dynamicVertecyProgram));
		}

		this.simpleParticleProgram = this.gl.createProgram();
		this.gl.attachShader(this.simpleParticleProgram, simpleParticleVertexShader);
		this.gl.attachShader(this.simpleParticleProgram, simpleParticleFragmentShader);
		this.gl.linkProgram(this.simpleParticleProgram);
		if (!this.gl.getProgramParameter(this.simpleParticleProgram, this.gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.simpleParticleProgram));
		}

		this.particleProgram = this.gl.createProgram();
		this.gl.attachShader(this.particleProgram, particleVertexShader);
		this.gl.attachShader(this.particleProgram, particleFragmentShader);
		this.gl.linkProgram(this.particleProgram);
		if (!this.gl.getProgramParameter(this.particleProgram, this.gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.particleProgram));
		}

		this.shaderProgram = this.gl.createProgram();
		this.gl.attachShader(this.shaderProgram, vertexShader);
		this.gl.attachShader(this.shaderProgram, fragmentShader);
		this.gl.linkProgram(this.shaderProgram);		 
		if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.shaderProgram));
		}

		this.initTextures(this.gl, asset);
	}

	private initTextures(gl: WebGLRenderingContext, asset: Asset) {

		this.glTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
  		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.texture);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  		gl.generateMipmap(gl.TEXTURE_2D);

		this.frostParticelTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.frostParticelTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.particleTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		this.genericParticleTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.genericParticleTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.genericParticleTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.BLEND);
	}

	private compileShader(source: string, shaderType: ShaderType) {
		var shader: WebGLShader;

		if(shaderType == ShaderType.Fragment) {
			shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
		} else if (shaderType == ShaderType.Vertex) {
			shader = this.gl.createShader(this.gl.VERTEX_SHADER);
		}

		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);

		if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
     		console.log("An error occurred compiling the shaders: " + this.gl.getShaderInfoLog(shader));
     		return null;
   		}

   		return shader;
	}
}