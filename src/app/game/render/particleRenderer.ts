import { Context } from '../context';
import { RenderCall } from './renderCall';
import { ParticleHandler } from '../handler/particleHandler';
import { Particle } from '../particle/particle';

export class ParticleRenderer {

	private context: Context;
	private gl: WebGLRenderingContext;
	private shaderProgram: WebGLShader;

	private pointLifetimesBuffer: any;
	private pointStartPositionsBuffer: any;
	private pointEndPositionsBuffer: any;

	private startPositionLocation: number;
	private endPositionLocation: number;
	private lifeTimeAttribute: number;

	private timeUniform: WebGLUniformLocation;
	private uniformCenterLocation: WebGLUniformLocation;
	private samplerUniform: WebGLUniformLocation;
	private colorLocation: WebGLUniformLocation;

	private time: number;
	private elapsed: number;
	private centerPos: number[];
	private color: number[];

	private particleHandler: ParticleHandler;

	constructor(context: Context, particleHandler: ParticleHandler) {
		this.context = context;
		this.particleHandler = particleHandler;
		this.gl = this.context.gl;
		//this.gl.enable(0x8642);
		this.shaderProgram = this.context.particleProgram;
		this.gl.useProgram(this.shaderProgram);

		this.lifeTimeAttribute = this.gl.getAttribLocation(this.shaderProgram, "aLifetime");

		this.startPositionLocation = this.gl.getAttribLocation(this.shaderProgram, "aStartPosition");

		this.endPositionLocation = this.gl.getAttribLocation(this.shaderProgram, "aEndPosition");

		this.samplerUniform = this.gl.getUniformLocation(this.shaderProgram, "sTexture");
		this.uniformCenterLocation = this.gl.getUniformLocation(this.shaderProgram, "uCenterPosition");
		this.colorLocation = this.gl.getUniformLocation(this.shaderProgram, "uColor");
		this.timeUniform = this.gl.getUniformLocation(this.shaderProgram, "uTime");

		this.pointEndPositionsBuffer = this.gl.createBuffer() as any;
		this.pointStartPositionsBuffer = this.gl.createBuffer() as any;
		this.pointLifetimesBuffer = this.gl.createBuffer() as any;

		this.time = 0;
		this.elapsed = 0;
		this.color = [0.8, 0.8, 1, 1];
	}

	public initBuffers() {

		this.gl.useProgram(this.shaderProgram);
		var numParticles = this.particleHandler.particles.length;

		let lifetimes: number[] = [];
		let startPositions: number[] = [];
		let endPositions: number[] = [];

		let deadParticles: Particle[] = [];

		for (let particle of this.particleHandler.particles) {
			lifetimes.push(particle.lifetime);
			startPositions.push.apply(startPositions, particle.startPos);
			endPositions.push.apply(endPositions, particle.endPos);

			if (particle.lifetime >= 1) {
				deadParticles.push(particle);
			}
		}

		for (let particle of deadParticles) {

			let index = this.particleHandler.particles.indexOf(particle);

			if (index != -1) {
				this.particleHandler.particles.splice(index, 1);
			}

		}

		this.centerPos = [0, 0, 0];
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointLifetimesBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(lifetimes), this.gl.STATIC_DRAW);
		this.pointLifetimesBuffer.itemSize = 1;
		this.pointLifetimesBuffer.numItems = numParticles;

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointStartPositionsBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(startPositions), this.gl.STATIC_DRAW);
		this.pointStartPositionsBuffer.itemSize = 3;
		this.pointStartPositionsBuffer.numItems = numParticles;

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointEndPositionsBuffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(endPositions), this.gl.STATIC_DRAW);
		this.pointEndPositionsBuffer.itemSize = 3;
		this.pointEndPositionsBuffer.numItems = numParticles;
	}

	public update(delta: number) {

		this.elapsed += delta;
		if (this.elapsed > 3000) {
			this.time = 0;
			this.elapsed = 0;
			this.particleHandler.particles = [];
		} else {
			this.time = this.elapsed / 3000;
			this.particleHandler.createFrostBlast();
		}
	}

	public render() {

		if (this.particleHandler.particles.length > 0) {
			this.initBuffers();
			this.gl.enableVertexAttribArray(this.lifeTimeAttribute);
			this.gl.enableVertexAttribArray(this.startPositionLocation);
			this.gl.enableVertexAttribArray(this.endPositionLocation);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointLifetimesBuffer);
			this.gl.vertexAttribPointer(this.lifeTimeAttribute, this.pointLifetimesBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointStartPositionsBuffer);
			this.gl.vertexAttribPointer(this.startPositionLocation, this.pointStartPositionsBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointEndPositionsBuffer);
			this.gl.vertexAttribPointer(this.endPositionLocation, this.pointEndPositionsBuffer.itemSize, this.gl.FLOAT, false, 0, 0);

			this.gl.activeTexture(this.gl.TEXTURE0);
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.context.particleTexture);
			this.gl.uniform1i(this.samplerUniform, 0);

			this.gl.uniform3f(this.uniformCenterLocation, this.centerPos[0], this.centerPos[1], this.centerPos[2]);
			this.gl.uniform4f(this.colorLocation, this.color[0], this.color[1], this.color[2], this.color[3]);
			this.gl.uniform1f(this.timeUniform, this.time);

			this.gl.drawArrays(this.gl.POINTS, 0, this.pointLifetimesBuffer.numItems);

			this.gl.disableVertexAttribArray(this.lifeTimeAttribute);
			this.gl.disableVertexAttribArray(this.startPositionLocation);
			this.gl.disableVertexAttribArray(this.endPositionLocation);
		}
	}

}