import { Rectangle, Animation, Vector } from '../'

export class RotationAnimation extends Animation {

    private vec: Vector;
    public angle: number;

    constructor(vec: Vector, texturenumbers: number[]) {
        super(texturenumbers);
        this.vec = vec;
    }

    public next(delta: number) {
        this.angle = Math.atan2(this.vec.x, this.vec.y);
        
        if(this.inverse) {
            this.angle = this.angle + Math.PI * 0.5;
        } else {
            this.angle = this.angle + Math.PI * 1.5;
        }

        super.next(delta);
    }
}