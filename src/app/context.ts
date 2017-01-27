import { Observable, Subscription, Observer } from 'rxjs';
import { ShaderType } from './';

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

	public init(vertexShader: string, fragmentShader: string, width: number, height: number, pointer: boolean, parent?: HTMLElement) {
		this.initContext(width, height, pointer, parent);
		this.initShaders(vertexShader, fragmentShader);
	}

	public clear() {
		this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
		this.gl.clearColor(0, 0, 0, 0.95);
	}

	private initContext(width: number, height: number, pointer: boolean, parent?: HTMLElement) {
		
		var div = document.createElement("div");

		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;
		div.style.border = "1px solid #aaa";
		div.style.display = "inline-block";
		if(!pointer) {
			div.style.cursor = "none";	
		}
		
		div.appendChild(this.canvas);
		if(parent) {
			parent.appendChild(div);
		} else {
			document.body.appendChild(div);	
		}

		this.gl = this.canvas.getContext("experimental-webgl");

		console.log("Context initialized...");
	}

	private initShaders(vertexShaderRaw: string, fragmentShaderRaw: string,) {
		let vertexShader = this.compileShader(vertexShaderRaw, ShaderType.Vertex);
		let fragmentShader = this.compileShader(fragmentShaderRaw, ShaderType.Fragment);

		this.shaderProgram = this.gl.createProgram();
		this.gl.attachShader(this.shaderProgram, vertexShader);
		this.gl.attachShader(this.shaderProgram, fragmentShader);
		this.gl.linkProgram(this.shaderProgram);		 
		if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
			alert("Unable to initialize the shader program: " + this.gl.getProgramInfoLog(this.shaderProgram));
		}
		this.gl.useProgram(this.shaderProgram);

		this.initTextures(this.gl);
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
  		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  		gl.generateMipmap(gl.TEXTURE_2D);
  		gl.bindTexture(gl.TEXTURE_2D, null);

  		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.BLEND);

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
}