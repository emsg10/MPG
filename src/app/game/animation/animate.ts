import { Rectangle } from '../model'

export class Animate {

	public textureNumber: number[] = [];
	public timeToChange: number = 100;
	public areaToRender: Rectangle;
	public repetitions: number;
	public inverse = false;
	private lastChange: number = 0;
	private frameIndex: number = 0;

	constructor() {
	}

	public next(delta: number) {

		this.lastChange += delta;

		if(this.lastChange >= this.timeToChange) {
			this.lastChange = 0;
			this.frameIndex++;
			if(this.repetitions) {
				this.repetitions--;
			}
			if(this.frameIndex >= this.textureNumber.length) {
				this.frameIndex = 0;
			}
		}
	}

	public getCurrentFrame() {
		return this.textureNumber[this.frameIndex];
	}
}