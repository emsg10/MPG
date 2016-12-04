import { Vector } from '../../model'

export class Animate {

	public frames: Vector[] = [];
	private frameIndex: number = 0;
	private frameRenderTimes: number = 0;
	private frameRenderMaxTimes: number = 4;

	constructor() {
	}

	public next() {

		this.frameRenderTimes++;

		if(this.frameRenderTimes >= this.frameRenderMaxTimes) {
			this.frameRenderTimes = 0;
			this.frameIndex++;
			if(this.frameIndex >= this.frames.length) {
				this.frameIndex = 0;
			}
		}
	}

	public getCurrentFrame() {
		return this.frames[this.frameIndex];
	}
}