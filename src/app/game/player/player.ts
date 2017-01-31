import { Vector, Rectangle, Sprite, Animation } from '../model';
import { RenderCall } from '../render/renderCall';
import { RenderHelper } from '../render/renderHelper';
import { Context } from '../';
import { CollisionData } from '../collision';
import { ProjectileHandler } from '../handler/projectileHandler';
import { AnimationHandler } from '../handler/animationHandler';
import { Gravity } from '../forces/gravity';

export class Player {

	public position: Vector;
	public velocity: Vector = new Vector(0, 0);
	public toMove: Vector = new Vector(0, 0);
	public defaultJumpSpeed: number = -0.7;
	public jumpSpeed: number = this.defaultJumpSpeed;
	public dead: boolean = false;
	public channelingCanceled: boolean = false;
	private context: Context;
	private projectileHandler: ProjectileHandler;
	private animationHandler: AnimationHandler;
	private maxSpeed: number = 0.3;
	private drag: number = 0.0015;
	private acceleration: number = 0.009;
	private gravityStrength: number = 0.0025;
	private runningAnimation: Animation = new Animation();
	private idleAnimation: Animation = new Animation();
	private channelAnimation: Animation = new Animation();
	private castAnimation: Animation = new Animation();
	private idleTime = 3000;
	private idleTimeChange = 3000;
	private inverse: boolean = false;
	private moving: boolean = false;
	private spriteSizeX: number;
	private spriteSizeY: number;
	private gravity: Gravity = new Gravity(this.gravityStrength);
	private jumping: boolean = false;
	private renderHelper = RenderHelper.getInstance();
	private channeling: boolean = false;
	private channelValue: number;
	private defaultChannelValue: number = 20;
	private maxChannelValue: number = 100;
	private channelSpeed: number = 0.03;
	private channelSpellAnimation: Animation = null;
	private savedCast: boolean;

	constructor(position: Vector, context: Context, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler, spriteSizeX: number, spriteSizeY: number) {
		this.context = context;
		this.position = position;
		this.projectileHandler = projectileHandler;
		this.animationHandler = animationHandler;

		this.spriteSizeX = spriteSizeX;
		this.spriteSizeY = spriteSizeY;

		this.idleAnimation.textureNumber.push(203);

		this.channelAnimation.textureNumber.push(204);

		this.castAnimation.textureNumber.push(205);
		this.castAnimation.textureNumber.push(208);
		this.castAnimation.repetitions = 0;
		this.castAnimation.timeToChange = 120;

		this.runningAnimation.textureNumber.push(200);
		this.runningAnimation.textureNumber.push(201);
		this.runningAnimation.textureNumber.push(202);
	}

	public createRenderCall() {

		let call = new RenderCall();
		let x: number = this.position.x;
		let x1: number;
		let x2: number;
		let textureNumber: number;

		if (this.inverse) {
			x2 = x;
			x1 = x + (this.spriteSizeX);
		} else {
			x2 = x + (this.spriteSizeX);
			x1 = x;
		}

		let y1 = this.position.y;
		let y2 = this.position.y + (this.spriteSizeY);

		call.context = this.context;

		call.vertecies = [
			x1, y1,
			x2, y2,
			x2, y1,
			x1, y1,
			x2, y2,
			x1, y2
		];

		if (this.castAnimation.repetitions > 0) {
			textureNumber = this.castAnimation.getCurrentFrame();
		} else if (this.channeling && this.velocity.x == 0) {
			textureNumber = this.channelAnimation.getCurrentFrame();
			this.idleTime = this.idleTimeChange;
		} else if (this.idleTime >= this.idleTimeChange) {
			textureNumber = this.idleAnimation.getCurrentFrame();
		} else {
			textureNumber = this.runningAnimation.getCurrentFrame();
		}

		call.textureCoords = this.renderHelper.getTextureCoordinates([], textureNumber);
		call.indecies = [0, 1, 2, 3, 4, 5];

		return call;

	}



	public update(collisionData: CollisionData, delta: number) {

		let deltaDrag = delta * this.drag;

		if (collisionData.fallDeath) {
			this.dead = true;
		}

		if (collisionData.groundCollision) {
			this.velocity.y = 0;

			if (collisionData.normalY == -1) {
				if (this.jumping) {
					this.idleTime = 0;
					this.velocity.y = this.jumpSpeed;
				}
			}
		}

		if (collisionData.wallCollision) {
			this.velocity.x = 0;
		}

		if (this.velocity.x != 0 || collisionData.wallCollision) {
			this.idleTime = 0;
			this.runningAnimation.next(delta);
		} else {
			this.idleTime += delta;
		}

		if (!this.moving) {
			if (this.velocity.x > 0) {
				this.velocity.x -= deltaDrag;
				if (this.velocity.x < deltaDrag) {
					this.velocity.x = 0;
				}
			} else if (this.velocity.x < 0) {
				this.velocity.x += deltaDrag;
				if (this.velocity.x > deltaDrag) {
					this.velocity.x = 0;
				}
			}
		}

		if(this.castAnimation.repetitions > 0) {
			this.castAnimation.next(delta);
			if(this.castAnimation.repetitions == 1) {
				if(this.savedCast) {
					this.projectileHandler.createFireball(this.getCalculatedPos(), this.channelValue, this.inverse);
					this.savedCast = false;
				}
			}
		}


		this.fall(delta);
		this.jumping = false;
		this.moving = false;
		this.toMove.x = this.velocity.x * delta;
		this.toMove.y = this.velocity.y * delta;
	}

	public moveRight(delta: number) {
		this.channelingCanceled = true;

		if (this.velocity.x < this.maxSpeed) {
			this.velocity.x += this.acceleration * delta;
		}

		if (this.velocity.x > this.maxSpeed) {
			this.velocity.x = this.maxSpeed;
		}

		this.inverse = false;
		this.moving = true;
	}

	public moveLeft(delta: number) {
		this.channelingCanceled = true;

		if (this.velocity.x > -this.maxSpeed) {
			this.velocity.x -= this.acceleration * delta;
		}

		if (this.velocity.x < this.maxSpeed) {
			this.velocity.x = -this.maxSpeed;
		}

		this.inverse = true;
		this.moving = true;
	}

	public getCollisionArea() {
		var collisionArea = new Rectangle(this.position.x, this.position.y, 45, 42);

		return collisionArea;
	}

	public fall(delta: number) {
		this.gravity.apply(this.velocity, delta);
	}

	public jump() {
		this.channelingCanceled = true;

		if (!this.jumping) {
			this.jumping = true;
		}
	}

	public channel(channeling: boolean, delta: number) {
		if (channeling) {
			if (this.channelingCanceled) {
				this.channelValue = this.defaultChannelValue;
			}
			if (this.channeling) {
				this.createSpellChannelAnimation(this.inverse);
				if (this.channelValue <= this.maxChannelValue) {
					this.channelValue += (this.channelSpeed * delta);
				} else {
					this.channelValue = this.maxChannelValue;
				}
			} else {
				this.channelValue = this.defaultChannelValue;
				this.channeling = true;
			}
		} else {
			if (this.channeling) {
				this.channeling = false;
				if (this.channelingCanceled) {
					this.removeSpellChanneling();
					this.projectileHandler.createFireball(this.getCalculatedPos(), this.defaultChannelValue, this.inverse);
					this.castAnimation.repetitions = 2;
				} else {
					this.removeSpellChanneling();
					//this.projectileHandler.createFireball(this.getCalculatedPos(), this.channelValue, this.inverse);
					this.savedCast = true;
					this.castAnimation.repetitions = 2;
				}
			}
		}
	}

	private getCalculatedPos() {
		return new Vector(this.calcPos(this.position.x, this.channelValue, 22), this.calcPos(this.position.y, this.channelValue, 30))
	}

	private calcPos(value: number, size: number, offset: number) {
		return value - (size / 2 - offset);
	}

	private createSpellChannelAnimation(inverse: boolean) {
		if (!this.channelSpellAnimation) {
			if(inverse) {
				this.channelSpellAnimation = this.animationHandler.fireball_left(this.getCalculatedPos(), this.channelValue);
			} else {
				this.channelSpellAnimation = this.animationHandler.fireball_right(this.getCalculatedPos(), this.channelValue);
			}
		} else {
			let calcPos = this.getCalculatedPos();
			this.channelSpellAnimation.areaToRender.width = this.channelValue;
			this.channelSpellAnimation.areaToRender.height = this.channelValue;
			this.channelSpellAnimation.areaToRender.x = calcPos.x;
			this.channelSpellAnimation.areaToRender.y = calcPos.y;
		}
	}

	private removeSpellChanneling() {
		this.animationHandler.remove(this.channelSpellAnimation);
		this.channelSpellAnimation = null;
	}
}