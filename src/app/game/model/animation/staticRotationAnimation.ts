import { Rectangle, Animation, Vector } from '../'

export class StaticRotationAnimation extends Animation {

    private vec: Vector;
    public angle: number;

    constructor(vec: Vector, inverse: boolean, texturenumbers: number[]) {
        super(texturenumbers);
        this.vec = vec;
        this.inverse = inverse;
        this.angle = Math.atan2(this.vec.x, this.vec.y);
        if(this.inverse) {
            this.angle = this.angle + Math.PI * 0.5;
        } else {
            this.angle = this.angle + Math.PI * 1.5;
        }
    }

    public next(delta: number) {
        super.next(delta);
    }
}