import { Context } from '../context';
import { RenderCall } from './renderCall';

export class Renderer {

	private context: Context;
	private gl: WebGLRenderingContext;
	private shaderProgram: WebGLShader;

	private vertexBuffer: WebGLBuffer;
	private textureCoordBuffer: WebGLBuffer;
	private indeciesBuffer: WebGLBuffer;
	private colorBuffer: WebGLBuffer;

	private colorAttributeLocation: number;
	private positionLocation: number;
	private textureCoordAttribute: number;
	private rotationLocation: WebGLUniformLocation;
	private resolutionLocation: WebGLUniformLocation;

	constructor(context: Context) {
		this.context = context;
		this.gl = this.context.gl;
		this.shaderProgram = this.context.shaderProgram;
		this.gl.useProgram(this.shaderProgram);
		this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_position");
		this.colorAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, "a_color");
		this.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "a_texture_coord");
		this.rotationLocation = this.gl.getUniformLocation(this.shaderProgram, "u_rotation");
		this.resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");

		this.colorBuffer = this.gl.createBuffer();
		this.vertexBuffer = this.gl.createBuffer();
		this.textureCoordBuffer = this.gl.createBuffer();
		this.indeciesBuffer = this.gl.createBuffer();
	}

	public render(renderCalls: RenderCall[]) {
		this.gl.useProgram(this.shaderProgram);
		for(let renderCall of renderCalls) {
			var rotation = [0, 1];
			
			this.gl.enableVertexAttribArray(this.positionLocation);
			this.gl.enableVertexAttribArray(this.textureCoordAttribute);
			this.gl.enableVertexAttribArray(this.colorAttributeLocation);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.vertecies), this.gl.STATIC_DRAW);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.textureCoords), this.gl.STATIC_DRAW);
			
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.color), this.gl.STATIC_DRAW);

			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indeciesBuffer);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(renderCall.indecies), this.gl.STATIC_DRAW);

			this.gl.uniform2fv(this.rotationLocation, rotation);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
			
			this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
			this.gl.uniform2f(this.resolutionLocation, this.context.gl.canvas.width, this.context.gl.canvas.height);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
			this.gl.vertexAttribPointer(this.textureCoordAttribute, 2, this.gl.FLOAT, false, 0, 0);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
			this.gl.vertexAttribPointer(this.colorAttributeLocation, 4, this.gl.FLOAT, false, 0, 0);

			this.gl.activeTexture(this.gl.TEXTURE0);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.context.glTexture);
			
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indeciesBuffer);
			this.gl.drawElements(this.gl.TRIANGLES, renderCall.indecies.length, this.gl.UNSIGNED_SHORT, 0)

			this.gl.disableVertexAttribArray(this.positionLocation);
			this.gl.disableVertexAttribArray(this.textureCoordAttribute);
			this.gl.disableVertexAttribArray(this.colorAttributeLocation);
		}

		
	}
	
}