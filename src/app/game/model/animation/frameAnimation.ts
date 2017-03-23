import { Rectangle, Animation, Vector } from '../'

export class FrameAnimation extends Animation {

    private lastFrameIndex: number;
    private growthX: number;
    private growthY: number;
    private offsetY: number = 20;
    private offsetX: number = 10;
    private particleFunction: (position: Vector) => void;

	constructor(growthX: number, growthY: number, offsetX: number, offsetY: number ,particleFunction: (position: Vector) => void) {
        super();

        this.particleFunction = particleFunction;
        this.growthX = growthX;
        this.growthY = growthY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.lastFrameIndex = this.frameIndex;
	}

	public next(delta: number) {
        if(this.lastFrameIndex != this.frameIndex) {
            this.lastFrameIndex = this.frameIndex;
            this.areaToRender.x += this.growthX;
            this.areaToRender.y += this.growthY;
        }
        
        this.particleFunction(new Vector(this.areaToRender.x + this.offsetX, this.areaToRender.y - this.offsetY));

        super.next(delta);
    }
}