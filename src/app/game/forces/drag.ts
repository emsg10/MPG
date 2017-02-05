import { Vector } from '../model';

export class Drag {
    private strength = 0;

    constructor(strength: number) {
        this.strength = strength;
    }

    public apply(vector: Vector, delta: number) {

        let deltaDrag = delta * this.strength;

        if (vector.x > 0) {
            vector.x -= deltaDrag;
            if (vector.x < deltaDrag) {
                vector.x = 0;
            }
        } else if (vector.x < 0) {
            vector.x += deltaDrag;
            if (vector.x > deltaDrag) {
                vector.x = 0;
            }
        }

    }
}