import { Rectangle } from '../';
import { RenderHelper } from '../../render';

export class Animation {

	public timeToChange: number = 100;
	public areaToRender: Rectangle;
	public repetitions: number;
	public inverse = false;
	public delay = 0;
	public frameIndex: number = 0;
	public color: number[];
	public onCompletion: () => void;
	public lastChange: number = 0;
	public textureCoords: number[][] = [];

	constructor(textureNumbers: number[]) {
		for (let textureNumber of textureNumbers) {
			this.textureCoords.push(RenderHelper.getInstance().getTextureCoordinates([], textureNumber));
		}
	}

	public next(delta: number) {

		this.lastChange += delta;

		if (this.lastChange >= this.timeToChange) {
			this.lastChange = 0;
			if (this.delay > 0) {
				this.delay--;
			}
			this.frameIndex++;
			if (this.repetitions) {
				this.repetitions--;
			}
			if (this.frameIndex >= this.textureCoords.length) {
				this.frameIndex = 0;
			}
		}
	}

	public getCurrentFrame() {
		return this.textureCoords[this.frameIndex];
	}

	public reset() {
		this.frameIndex = 0;
		this.lastChange = 0;
	}
}