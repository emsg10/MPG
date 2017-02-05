import { Animation, Vector, SpellType } from './';
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

	update(channel: boolean, delta: number, inverse: boolean, position: Vector, type: SpellType) {
		if (channel) {
			if (this.cancel) {
				this.value = this.defaultValue;
			}
			if (this.channeling) {
				this.createSpellAnimation(position, this.value, inverse, type);
				if (this.value <= this.maxValue) {
					this.value += (this.speed * delta);
				} else {
					this.value = this.maxValue;
				}
			} else {
				if (!this.castSpell) {
					this.value = this.defaultValue;
					this.channeling = true;
				}
			}
		} else {
			if (this.channeling) {
				this.channeling = false;
				if (this.cancel) {
					this.removeSpellChanneling();
					this.projectileHandler.createBolt(this.getCalculatedPos(position, this.value), this.defaultValue, inverse, type);
					this.castAnimation.repetitions = 2;
				} else {
					this.removeSpellChanneling();
					this.castSpell = true;
					this.castAnimation.repetitions = 2;
				}
			}
		}

		if (this.castAnimation.repetitions > 0) {
			this.casting = true;
		} else {
			this.casting = false;
		}

		this.updateCast(delta, position, inverse, type);

		this.cancel = false;
	}

	private createSpellAnimation(position: Vector, animationSize: number, inverse: boolean, type: SpellType) {
		if (!this.spellAnimation) {
			this.spellAnimation = this.animationHandler.createSpellAnimation(this.getCalculatedPos(position, animationSize), animationSize, inverse, type);
		} else {
			let calcPos = this.getCalculatedPos(position, animationSize);
			this.spellAnimation.areaToRender.width = animationSize;
			this.spellAnimation.areaToRender.height = animationSize;
			this.spellAnimation.areaToRender.x = calcPos.x;
			this.spellAnimation.areaToRender.y = calcPos.y;
		}
	}

	public switchAnimation(position: Vector, type: SpellType) {
		if (this.spellAnimation != null) {
			if (this.spellAnimation.inverse) {
				this.removeSpellChanneling();
				this.spellAnimation = this.animationHandler.createSpellAnimation(position, this.defaultValue, false, type);
			} else {
				this.removeSpellChanneling();
				this.spellAnimation = this.animationHandler.createSpellAnimation(position, this.defaultValue, true, type);
			}
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

	private updateCast(delta: number, position: Vector, inverse: boolean, type: SpellType) {
		if (this.castAnimation.repetitions > 0) {
			this.castAnimation.next(delta);
			if (this.castAnimation.repetitions == 1) {
				if (this.castSpell) {
					this.projectileHandler.createBolt(this.getCalculatedPos(position, this.value), this.value, inverse, type);
					this.castSpell = false;
				}
			}
		}
	}
}