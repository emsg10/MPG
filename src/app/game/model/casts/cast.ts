import { Animation } from '../../model';

export abstract class Cast {

    public done: boolean = false;
    public currentAnimation: Animation;

    constructor() {
    }

    public update(delta: number) {
    }

    public cancel() {
    }

    public reset() {
        this.done = false;
    }
}