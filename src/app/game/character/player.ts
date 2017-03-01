import { Vector, Rectangle, Sprite, Animation, SpellCast, SpellType } from '../model';
import { RenderCall } from '../render/renderCall';
import { RenderHelper } from '../render/renderHelper';
import { Context } from '../';
import { CollisionData } from '../collision';
import { ProjectileHandler } from '../handler/projectileHandler';
import { AnimationHandler } from '../handler/animationHandler';
import { ParticleHandler } from '../handler/particleHandler';
import { Drag } from '../forces/drag';
import { Character } from './character';
import { DeathType } from './deathType';

export class Player extends Character{

	public defaultJumpSpeed: number = -0.7;
	public jumpSpeed: number = this.defaultJumpSpeed;
	private projectileHandler: ProjectileHandler;
	private animationHandler: AnimationHandler;
	private particleHandler: ParticleHandler;
	private drag: number = 0.0015;
	private dragForce: Drag = new Drag(this.drag);
	private idleAnimation: Animation = new Animation();
	private idleTime = 3000;
	private idleTimeChange = 3000;
	private jumping: boolean = false;
	private renderHelper = RenderHelper.getInstance();
	private spellCast: SpellCast;
	private spellType: SpellType;
	private context: Context;
	private runningAnimation = new Animation();

	constructor( position: Vector, context: Context, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler, particleHandler: ParticleHandler, width: number, height: number) {
		super(position, width, height);
		this.context = context;
		this.projectileHandler = projectileHandler;
		this.animationHandler = animationHandler;
		this.particleHandler = particleHandler;
		this.spellCast = new SpellCast(this.animationHandler, this.projectileHandler);

		this.spellCast.defaultValue = 20;
		this.spellCast.maxValue = 100;
		this.spellCast.speed = 0.03;

		this.spellCast.channelAnimation.textureNumber.push(204);

		this.spellCast.castAnimation.textureNumber.push(205);
		this.spellCast.castAnimation.textureNumber.push(208);
		this.spellCast.castAnimation.repetitions = 0;
		this.spellCast.castAnimation.timeToChange = 120;

		this.idleAnimation.textureNumber.push(203);

		this.runningAnimation.textureNumber.push(200);
		this.runningAnimation.textureNumber.push(201);
		this.runningAnimation.textureNumber.push(202);
	}

	public createRenderCall(renderCall: RenderCall) {

		let call = new RenderCall();
		let x: number = this.position.x;
		let x1: number;
		let x2: number;
		let textureNumber: number;

		if (this.inverse) {
			x2 = x;
			x1 = x + (this.width);
		} else {
			x2 = x + (this.width);
			x1 = x;
		}

		let y1 = this.position.y;
		let y2 = this.position.y + (this.height);

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

		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, textureNumber);
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
		renderCall.vertecies.push.apply(renderCall.vertecies, call.vertecies)

		return renderCall;

	}

	public update(collisionData: CollisionData, delta: number, type: SpellType) {

		if(this.deathType) {
			if(this.deathType == DeathType.swordDeath) {
				this.dead = true;
				this.projectileHandler.createPlayerSword_death(this.position, this.inverse, this.velocity);
			}
		}

		if (collisionData.fallDeath) {
			this.dead = true;
			this.animationHandler.fallDeath(this.position);
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
			this.dragForce.apply(this.velocity, delta);
		}

		this.spellType = type;
		this.fall(delta);
		this.jumping = false;
		this.moving = false;
		this.toMove.x = this.velocity.x * delta;
		this.toMove.y = this.velocity.y * delta;
	}

	public moveRight(delta: number) {
		this.spellCast.cancel = true;

		if(this.inverse) {
			this.spellCast.switchAnimation(this.position, this.spellType);
		}

		super.moveRight(delta);
	}

	public moveLeft(delta: number) {
		this.spellCast.cancel = true;
		if(!this.inverse) {
			this.spellCast.switchAnimation(this.position, this.spellType);
		}

		super.moveLeft(delta);
	}

	public getCollisionArea() {
		var collisionArea = new Rectangle(this.position.x, this.position.y, 43, 42);

		return collisionArea;
	}

	public jump() {
		this.spellCast.cancel = true;

		if (!this.jumping) {
			this.jumping = true;
		}
	}

	public channel(channeling: boolean, delta: number, type: SpellType) {
		this.spellCast.update(channeling, delta, this.inverse, this.position, type);
	}

	public cast() {
		this.particleHandler.createFrostBlast(this.position, this.inverse);
	}

}