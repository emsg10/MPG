import { Rectangle } from '../'

export class Animation {

	public textureNumber: number[] = [];
	public timeToChange: number = 100;
	public areaToRender: Rectangle;
	public repetitions: number;
	public inverse = false;
	public delay = 0;
	public frameIndex: number = 0;
	public color: number[];
	public onCompletion: () => void;
	private lastChange: number = 0;	

	constructor() {
	}

	public next(delta: number) {

		this.lastChange += delta;

		if(this.lastChange >= this.timeToChange) {
			this.lastChange = 0;
			if(this.delay > 0) {
				this.delay--;
			}
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

	public reset() {
		this.frameIndex = 0;
		this.lastChange = 0;
	}
}