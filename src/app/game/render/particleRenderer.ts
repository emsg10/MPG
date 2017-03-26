import { Context } from '../context';
import { ParticleRenderCall } from './particleRenderCall';
import { ParticleHandler } from '../handler/particleHandler';
import { Particle } from '../particle/particle';
import { Enemy } from '../character/enemy';
import { CollisionDetection } from '../collision/collisionDetection';
import { Rectangle, SpellType } from '../model';

export class ParticleRenderer {

	private context: Context;
	private gl: WebGLRenderingContext;
	private shaderProgram: WebGLShader;
	private collisionDetection = CollisionDetection.getInstance();

	private pointRelativeTimeBuffer: any;
	private pointLifetimesBuffer: any;
	private pointStartPositionsBuffer: any;
	private pointEndPositionsBuffer: any;

	private startPositionLocation: number;
	private endPositionLocation: number;
	private lifeTimeAttribute: number;
	private relativeTimeAttribute: number;

	private particleTexture: WebGLUniformLocation;
	private genericParticle: WebGLUniformLocation;
	private colorLocation: WebGLUniformLocation;

	private elapsed: number;
	private centerPos: number[];
	private color: number[];

	private particleHandler: ParticleHandler;

	constructor(context: Context, particleHandler: ParticleHandler) {
		this.context = context;
		this.particleHandler = particleHandler;
		this.gl = this.context.gl;
		this.shaderProgram = this.context.particleProgram;
		this.gl.useProgram(this.shaderProgram);

		this.gl.bindAttribLocation(this.shaderProgram, 0, "a_relativeTime");
		this.gl.bindAttribLocation(this.shaderProgram, 1, "a_lifetime");
		this.gl.bindAttribLocation(this.shaderProgram, 2, "a_startPosition");
		this.gl.bindAttribLocation(this.shaderProgram, 3, "a_endPosition");

		this.relativeTimeAttribute = this.gl.getAttribLocation(this.shaderProgram, "a_relativeTime");
		this.lifeTimeAttribute = this.gl.getAttribLocation(this.shaderProgram, "a_lifetime");
		this.startPositionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_startPosition");
		this.endPositionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_endPosition");

		this.particleTexture = this.gl.getUniformLocation(this.shaderProgram, "u_particleTexture");
		this.colorLocation = this.gl.getUniformLocation(this.shaderProgram, "u_color");

		this.pointEndPositionsBuffer = this.gl.createBuffer() as any;
		this.pointStartPositionsBuffer = this.gl.createBuffer() as any;
		this.pointLifetimesBuffer = this.gl.createBuffer() as any;
		this.pointRelativeTimeBuffer = this.gl.createBuffer() as any;
	}

	public render(renderCalls: ParticleRenderCall[]) {

		for (let call of renderCalls) {
			if (call.length > 0) {
				this.gl.useProgram(this.shaderProgram);

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointRelativeTimeBuffer);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(call.relativeTime), this.gl.STATIC_DRAW);
				this.pointRelativeTimeBuffer.itemSize = 1;
				this.pointRelativeTimeBuffer.numItems = call.length;

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointLifetimesBuffer);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(call.lifetimes), this.gl.STATIC_DRAW);
				this.pointLifetimesBuffer.itemSize = 1;
				this.pointLifetimesBuffer.numItems = call.length;

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointStartPositionsBuffer);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(call.startPositions), this.gl.STATIC_DRAW);
				this.pointStartPositionsBuffer.itemSize = 3;
				this.pointStartPositionsBuffer.numItems = call.length;

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointEndPositionsBuffer);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(call.endPositions), this.gl.STATIC_DRAW);
				this.pointEndPositionsBuffer.itemSize = 3;
				this.pointEndPositionsBuffer.numItems = call.length;

				this.gl.enableVertexAttribArray(this.lifeTimeAttribute);
				this.gl.enableVertexAttribArray(this.relativeTimeAttribute);
				this.gl.enableVertexAttribArray(this.startPositionLocation);
				this.gl.enableVertexAttribArray(this.endPositionLocation);

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointRelativeTimeBuffer);
				this.gl.vertexAttribPointer(this.relativeTimeAttribute, this.pointRelativeTimeBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointLifetimesBuffer);
				this.gl.vertexAttribPointer(this.lifeTimeAttribute, this.pointLifetimesBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointStartPositionsBuffer);
				this.gl.vertexAttribPointer(this.startPositionLocation, this.pointStartPositionsBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointEndPositionsBuffer);
				this.gl.vertexAttribPointer(this.endPositionLocation, this.pointEndPositionsBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

				this.gl.activeTexture(this.gl.TEXTURE0);

				if(call.type == SpellType.frostBlast) {
					this.gl.bindTexture(this.gl.TEXTURE_2D, this.context.frostParticelTexture);
				} else {
					this.gl.bindTexture(this.gl.TEXTURE_2D, this.context.genericParticleTexture);
				}
				
				this.gl.uniform1i(this.particleTexture, 0);

				this.gl.uniform4f(this.colorLocation, call.color[0], call.color[1], call.color[2], call.color[3]);

				this.gl.drawArrays(this.gl.POINTS, 0, this.pointLifetimesBuffer.numItems);

				this.gl.disableVertexAttribArray(this.lifeTimeAttribute);
				this.gl.disableVertexAttribArray(this.relativeTimeAttribute);
				this.gl.disableVertexAttribArray(this.startPositionLocation);
				this.gl.disableVertexAttribArray(this.endPositionLocation);
			}
		}
	}

}