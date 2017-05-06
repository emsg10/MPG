import { Animation, Cast } from '../../model';

export class SpellCast extends Cast{

    public size: number = 20;
    public hasCast: boolean;
    private onCast: (animation: Animation, size: number) => Animation;
    private mainRepetion: number;

    constructor(animation: Animation, mainRepetion: number, onCast: (animation: Animation, size: number) => Animation) {
        super();
        this.currentAnimation = animation;
        this.onCast = onCast;
        this.mainRepetion = mainRepetion;
        this.hasCast = false;
    }

    public update(delta: number) {
        
        if(this.currentAnimation.repetitions == this.mainRepetion && !this.hasCast) {
            this.currentAnimation = this.onCast(this.currentAnimation, this.size);
            this.hasCast = true;
        }
        
        this.currentAnimation.next(delta);
        
        if (this.currentAnimation.repetitions <= 0) {
            this.done = true;
        }
    }

    public reset() {
        this.hasCast = false;
        this.currentAnimation.repetitions = 4;
        this.currentAnimation.reset();
        super.reset();
    }
}