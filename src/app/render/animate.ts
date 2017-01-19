import { Sprite } from '../../model'

export class Animate {

	public frames: Sprite[] = [];
	public timeToChange: number = 100;
	private lastChange: number = 0;
	private frameIndex: number = 0;

	constructor() {
	}

	public next(delta: number) {

		this.lastChange += delta;

		if(this.lastChange >= this.timeToChange) {
			this.lastChange = 0;
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