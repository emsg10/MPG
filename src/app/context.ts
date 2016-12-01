import $ = require('jquery');
import { Observable, Subscription, Observer } from 'rxjs';
import { ShaderType } from '../model';

export class Context
{
	public shaderProgram: WebGLProgram;
	public gl: WebGLRenderingContext;
	public canvas: HTMLCanvasElement;
	public texture: WebGLTexture;
	private observer: Observer<null>;
	

	constructor(){
	}

	public doneListener() {
		return new Observable((observer: any) => {
			this.observer = observer;
		});
	}

	public init() {
		this.initContext();
		this.initShaders();
	}

	private initContext() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = 1200;
		this.canvas.height = 800;
		document.body.appendChild(this.canvas);

		this.gl = this.canvas.getContext("experimental-webgl");

		console.log("Context initialized...");
	}

	private initShaders() {
		$.when( this.loadShader(ShaderType.Vertex), this.loadShader(ShaderType.Fragment) ).then((vertexData: string, fragmentData: string) => {
			var vertexShader = this.compileShader(vertexData[0], ShaderType.Vertex);
			var fragmentShader = this.compileShader(fragmentData[0], ShaderType.Fragment);

			this.shaderProgram = this.gl.createProgram();
			this.gl.attachShader(this.shaderProgram, vertexShader);
			this.gl.attachShader(this.shaderProgram, fragmentShader);
			this.gl.linkProgram(this.shaderProgram);		 
			if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
			 	alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.shaderProgram));
			}
			this.gl.useProgram(this.shaderProgram);

			this.initTextures(this.gl);
		});
	}

	private initTextures(gl: WebGLRenderingContext) {
		this.texture = gl.createTexture();
  		var textureImage = new Image();
  		textureImage.onload = () => {
  			this.handleTextureLoaded(textureImage, this.texture, gl);
  		};
  		textureImage.src = "/src/texture/tiles.png";
	}

	private handleTextureLoaded(image: HTMLImageElement, texture: WebGLTexture, gl: WebGLRenderingContext) {
  		gl.bindTexture(gl.TEXTURE_2D, texture);
  		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  		gl.generateMipmap(gl.TEXTURE_2D);
  		gl.bindTexture(gl.TEXTURE_2D, null);

  		this.observer.next(null);
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

	private loadShader(shaderType: ShaderType) {

		var shaderSource = "";

		if(shaderType == ShaderType.Fragment)
		{
			shaderSource = "src/shader/fragmentShader.c";
		} else if(shaderType == ShaderType.Vertex) {
			shaderSource = "src/shader/vertexShader.c";
		}

		var promise = $.ajax({url: shaderSource});

    	return promise;
	}
}