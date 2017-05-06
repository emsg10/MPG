import { Animation, Cast } from '../../model';

export class InstantCast extends Cast{

    private onCast: (animation: Animation) => Animation;

    constructor(animation: Animation, onCast: (animation: Animation) => Animation) {
        super();
        this.currentAnimation = animation;
        this.onCast = onCast;
    }

    public update(delta: number) {
        this.currentAnimation = this.onCast(this.currentAnimation);
        this.currentAnimation.next(delta);
            
        if (this.currentAnimation.repetitions <= 0) {
            this.done = true;
        }
    }

    public reset() {
        this.currentAnimation.reset();
        this.currentAnimation.repetitions = 1;
        super.reset();
    }
}