import { Observable, Subscription, Observer } from 'rxjs';
import { ShaderType, Asset } from './model';
import { TileAsset } from './map/model';

export class Context
{
	public shaderProgram: WebGLProgram;
	public simpleParticleProgram: WebGLProgram;
	public dynamicVertecyProgram: WebGLProgram;
	public colorShaderProgram: WebGLProgram;
	public gl: WebGLRenderingContext;
	public glTexture: WebGLTexture;
	public frostParticelTexture: WebGLTexture;
	public genericParticleTexture: WebGLTexture;
	public tileTextures = new Map<number, WebGLTexture>();

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

		let simpleParticleVertexShader = this.compileShader(asset.simpleParticleVertexShader, ShaderType.Vertex);
		let simpleParticleFragmentShader = this.compileShader(asset.simpleParticleFragmentShader, ShaderType.Fragment);

		let dynamicVertexShader = this.compileShader(asset.dynamicVertexShader, ShaderType.Vertex);
		let dynamicFragmentShader = this.compileShader(asset.dynamicFragmentShader, ShaderType.Fragment);

		let colorVertexShader = this.compileShader(asset.colorVertexShader, ShaderType.Vertex);
		let colorFragmentShader = this.compileShader(asset.colorFragmentShader, ShaderType.Fragment);

		this.colorShaderProgram = this.gl.createProgram();
		this.gl.attachShader(this.colorShaderProgram, colorVertexShader);
		this.gl.attachShader(this.colorShaderProgram, colorFragmentShader);
		this.gl.linkProgram(this.colorShaderProgram);
		if (!this.gl.getProgramParameter(this.colorShaderProgram, this.gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.colorShaderProgram));
		}

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

		this.shaderProgram = this.gl.createProgram();
		this.gl.attachShader(this.shaderProgram, vertexShader);
		this.gl.attachShader(this.shaderProgram, fragmentShader);
		this.gl.linkProgram(this.shaderProgram);		 
		if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.shaderProgram));
		}

		this.initAssetTextures(this.gl, asset)
	}

	private initAssetTextures(gl: WebGLRenderingContext, asset: Asset) {


		this.initTextures(gl, asset.tileAssets);
		this.initBaseTextures(gl, asset);

	}

	private initTextures(gl: WebGLRenderingContext, textureMap: Map<number, TileAsset>) {
		textureMap.forEach((tileAsset: TileAsset, key: number) => {

			let texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tileAsset.image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

			this.tileTextures.set(key, texture);
		});
	}

	private initBaseTextures(gl: WebGLRenderingContext, asset: Asset) {

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