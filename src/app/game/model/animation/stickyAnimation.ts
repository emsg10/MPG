import { Animation } from './animation';
import { Vector } from '../';

export class StickyAnimation {
    public animation: Animation;
    public offset: Vector;

    constructor(animation: Animation, offset: Vector) {
        this.animation = animation;
        this.offset = offset;
    }
}