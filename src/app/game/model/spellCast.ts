import { Animation, Vector } from './';
import { AnimationHandler } from '../handler/animationHandler';
import { ProjectileHandler } from '../handler/projectileHandler';

export class SpellCast {
    
	public maxValue: number;
	public speed: number;
	public defaultValue: number

	public channelAnimation = new Animation();
	public castAnimation = new Animation();

	public casting: boolean;
	public channeling = false;
	public cancel = false;

	private animationHandler: AnimationHandler;
	private projectileHandler: ProjectileHandler;
    private value: number = this.defaultValue;
	private spellAnimation: Animation = null; 
	private castSpell = false;
    
    constructor(animationHandler: AnimationHandler, projectileHandler: ProjectileHandler) {
        this.animationHandler = animationHandler;
		this.projectileHandler = projectileHandler;
    }

    update(channel: boolean, delta: number, inverse: boolean, position: Vector) {
        if (channel) {
			if (this.cancel) {
				this.value = this.defaultValue;
			}
			if (this.channeling) {
				this.createSpellAnimation(inverse, this.value, position);
				if (this.value <= this.maxValue) {
					this.value += (this.speed * delta);
				} else {
					this.value = this.maxValue;
				}
			} else {
				this.value = this.defaultValue;
				this.channeling = true;
			}
		} else {
			if (this.channeling) {
				this.channeling = false;
				if (this.cancel) {
					this.removeSpellChanneling();
					this.projectileHandler.createFireball(this.getCalculatedPos(position, this.value), this.defaultValue, inverse);
					this.castAnimation.repetitions = 2;
				} else {
					this.removeSpellChanneling();
					this.castSpell = true;
					this.castAnimation.repetitions = 2;
				}
			}
		}

		if(this.castAnimation.repetitions > 0) {
			this.casting = true;
		} else {
			this.casting = false;
		}

		this.updateCast(delta, position, inverse);

		this.cancel = false;
    }

    private createSpellAnimation(inverse: boolean, animationSize: number, position: Vector) {
		if (!this.spellAnimation) {
			if(inverse) {
				this.spellAnimation = this.animationHandler.fireball_left(this.getCalculatedPos(position, animationSize), animationSize);
			} else {
				this.spellAnimation = this.animationHandler.fireball_right(this.getCalculatedPos(position, animationSize), animationSize);
			}
		} else {
			let calcPos = this.getCalculatedPos(position, animationSize);
			this.spellAnimation.areaToRender.width = animationSize;
			this.spellAnimation.areaToRender.height = animationSize;
			this.spellAnimation.areaToRender.x = calcPos.x;
			this.spellAnimation.areaToRender.y = calcPos.y;
		}
	}

    private getCalculatedPos(position: Vector, size: number) {
		return new Vector(this.calcPos(position.x, size, 22), this.calcPos(position.y, size, 30))
	}

	private calcPos(value: number, size: number, offset: number) {
		return value - (size / 2 - offset);
	}

    private removeSpellChanneling() {
		this.animationHandler.remove(this.spellAnimation);
		this.spellAnimation = null;
	}

	private updateCast(delta: number, position: Vector, inverse: boolean) {
		if(this.castAnimation.repetitions > 0) {
			this.castAnimation.next(delta);
			if(this.castAnimation.repetitions == 1) {
				if(this.castSpell) {
					this.projectileHandler.createFireball(this.getCalculatedPos(position, this.value), this.value, inverse);
					this.castSpell = false;
				}
			}
		}
	}
}