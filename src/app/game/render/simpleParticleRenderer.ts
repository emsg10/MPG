import { Context } from '../context';
import { SimpleParticleRenderCall } from './simpleParticleRenderCall';
import { TextureType } from '../model';

export class SimpleParticleRenderer {

	private context: Context;
	private gl: WebGLRenderingContext;
	private shaderProgram: WebGLShader;

	private vertexBuffer: WebGLBuffer;
	private pointSizeBuffer: WebGLBuffer;

	private sizeAttributeLocation: number;
	private positionLocation: number;
	private resolutionLocation: WebGLUniformLocation;
	private colorUniformLocation: WebGLUniformLocation;

	constructor(context: Context) {
		this.context = context;
		this.gl = this.context.gl;
		this.shaderProgram = this.context.simpleParticleProgram;
		this.gl.useProgram(this.shaderProgram);

		this.gl.bindAttribLocation(this.shaderProgram, 0, "a_position");
		this.gl.bindAttribLocation(this.shaderProgram, 1, "a_pointSize");

		this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_position");
		this.sizeAttributeLocation = this.gl.getAttribLocation(this.shaderProgram, "a_pointSize");
		this.resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");
		this.colorUniformLocation = this.gl.getUniformLocation(this.shaderProgram, "u_color");

		this.vertexBuffer = this.gl.createBuffer();
		this.pointSizeBuffer = this.gl.createBuffer();
	}

	public render(renderCalls: SimpleParticleRenderCall[]) {
		this.gl.useProgram(this.shaderProgram);
		for (let renderCall of renderCalls) {

			if (renderCall.itemCount > 1) {
				this.gl.enableVertexAttribArray(this.positionLocation);
				this.gl.enableVertexAttribArray(this.sizeAttributeLocation);

				this.gl.uniform2f(this.resolutionLocation, this.context.gl.canvas.width, this.context.gl.canvas.height);
				this.gl.uniform4f(this.colorUniformLocation, renderCall.color[0], renderCall.color[1], renderCall.color[2], renderCall.color[3]);

				this.gl.bindTexture(this.gl.TEXTURE_2D, this.context.genericParticleTexture);

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.vertecies), this.gl.STATIC_DRAW);
				this.gl.enableVertexAttribArray(this.positionLocation);
				this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointSizeBuffer);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(renderCall.pointSize), this.gl.STATIC_DRAW);
				this.gl.enableVertexAttribArray(this.sizeAttributeLocation);
				this.gl.vertexAttribPointer(this.sizeAttributeLocation, 1, this.gl.FLOAT, false, 0, 0);

				this.gl.drawArrays(this.gl.POINTS, 0, renderCall.itemCount);

				this.gl.disableVertexAttribArray(this.positionLocation);
				this.gl.disableVertexAttribArray(this.sizeAttributeLocation);
			}


		}


	}

}