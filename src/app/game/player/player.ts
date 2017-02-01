import { Vector, Rectangle, Sprite, Animation, SpellCast } from '../model';
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
	private context: Context;
	private projectileHandler: ProjectileHandler;
	private animationHandler: AnimationHandler;
	private maxSpeed: number = 0.3;
	private drag: number = 0.0015;
	private acceleration: number = 0.009;
	private gravityStrength: number = 0.0025;
	private runningAnimation: Animation = new Animation();
	private idleAnimation: Animation = new Animation();
	private idleTime = 3000;
	private idleTimeChange = 3000;
	private inverse: boolean = false;
	private moving: boolean = false;
	private spriteSizeX: number;
	private spriteSizeY: number;
	private gravity: Gravity = new Gravity(this.gravityStrength);
	private jumping: boolean = false;
	private renderHelper = RenderHelper.getInstance();
	private spellCast: SpellCast;

	constructor(position: Vector, context: Context, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler, spriteSizeX: number, spriteSizeY: number) {
		this.context = context;
		this.position = position;
		this.projectileHandler = projectileHandler;
		this.animationHandler = animationHandler;
		this.spellCast = new SpellCast(this.animationHandler, this.projectileHandler);

		this.spellCast.defaultValue = 20;
		this.spellCast.maxValue = 100;
		this.spellCast.speed = 0.03;

		this.spellCast.channelAnimation.textureNumber.push(204);

		this.spellCast.castAnimation.textureNumber.push(205);
		this.spellCast.castAnimation.textureNumber.push(208);
		this.spellCast.castAnimation.repetitions = 0;
		this.spellCast.castAnimation.timeToChange = 120;

		this.spriteSizeX = spriteSizeX;
		this.spriteSizeY = spriteSizeY;

		this.idleAnimation.textureNumber.push(203);

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

		if (this.spellCast.casting) {
			textureNumber = this.spellCast.castAnimation.getCurrentFrame();
		} else if (this.spellCast.channeling && this.velocity.x == 0) {
			textureNumber = this.spellCast.channelAnimation.getCurrentFrame();
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

		this.fall(delta);
		this.jumping = false;
		this.moving = false;
		this.toMove.x = this.velocity.x * delta;
		this.toMove.y = this.velocity.y * delta;
	}

	public moveRight(delta: number) {
		this.spellCast.cancel = true;

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
		this.spellCast.cancel = true;

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
		this.spellCast.cancel = true;

		if (!this.jumping) {
			this.jumping = true;
		}
	}

	public channel(channeling: boolean, delta: number) {
		this.spellCast.update(channeling, delta, this.inverse, this.position);
	}

}