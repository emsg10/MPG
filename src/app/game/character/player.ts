import { Vector, Rectangle, Sprite, Animation, SpellType, StickyAnimation, DebugElement, Tile, DynamicTile, ChannelCast } from '../model';
import { RenderCall, ColorRenderCall, RenderHelper } from '../render';
import { Context } from '../';
import { CollisionData } from '../collision';
import { CollisionDetection } from '../collision/collisionDetection';
import { ProjectileHandler } from '../handler/projectileHandler';
import { AnimationHandler } from '../handler/animationHandler';
import { ParticleHandler } from '../handler/particleHandler';
import { SpellHandler } from '../handler/spellHandler';
import { Drag } from '../forces/drag';
import { Character } from './character';
import { DeathType } from './deathType';
import { DebugHandler } from '../handler/debugHandler';

export class Player extends Character {

	public defaultJumpSpeed: number = -0.7;
	public jumpSpeed: number = this.defaultJumpSpeed;
	public damageAnimations: StickyAnimation[] = [];
	public hp: number;
	public mana: number;
	public stunned = false;
	public lift: DynamicTile = null;
	public liftVelocity = new Vector(0, 0);
	private collisionDetection = CollisionDetection.getInstance();
	private projectileHandler: ProjectileHandler;
	private animationHandler: AnimationHandler;
	private particleHandler: ParticleHandler;
	private spellHandler: SpellHandler;
	private drag: number = 0.0015;
	private externalDragForce: number = 0.0005;
	private dragForce: Drag = new Drag(this.drag);
	private externalDrag = new Drag(this.externalDragForce);

	private stunnedAnimation: Animation = new Animation();
	private stunnedEffect: Animation = new Animation();
	private idleTime = 3000;
	private idleTimeChange = 3000;
	private jumping: boolean = false;
	private inJump = false;
	private renderHelper = RenderHelper.getInstance();
	private context: Context;
	private manaRegen = 1;
	private maxMana: number;
	private externalVelocity: Vector = new Vector(0, 0);

	private lowerAnimation: Animation;
	private upperAnimation: Animation;

	private lowerIdleAnimation: Animation = new Animation();
	private upperIdleAnimation: Animation = new Animation();

	private lowerJumpAnimation = new Animation();
	private upperJumpAnimation = new Animation();

	private lowerRunningAnimation = new Animation();
	private upperRunningAnimation = new Animation();

	private lowerStillAnimation = new Animation();
	private upperStillAnimation = new Animation();

	private onGroundTimer = 0;
	private shieldTextureCoords = this.renderHelper.getTextureCoordinates([], 199);

	private debugHandler = DebugHandler.getInstance();

	constructor(position: Vector, context: Context, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler, particleHandler: ParticleHandler, width: number, height: number, hp: number, mana: number) {
		super(position, width, height);
		this.context = context;
		this.projectileHandler = projectileHandler;
		this.animationHandler = animationHandler;
		this.particleHandler = particleHandler;
		this.spellHandler = new SpellHandler(this.animationHandler, this.projectileHandler, this.particleHandler, this);

		this.lowerIdleAnimation.textureNumber.push(162);
		this.upperIdleAnimation.textureNumber.push(163);

		this.upperRunningAnimation.textureNumber.push(170);
		this.upperRunningAnimation.textureNumber.push(171);
		this.upperRunningAnimation.textureNumber.push(172);
		this.upperRunningAnimation.textureNumber.push(170);
		this.upperRunningAnimation.textureNumber.push(173);
		this.upperRunningAnimation.textureNumber.push(174);
		this.upperRunningAnimation.timeToChange = 150;

		this.lowerRunningAnimation.textureNumber.push(165);
		this.lowerRunningAnimation.textureNumber.push(166);
		this.lowerRunningAnimation.textureNumber.push(167);
		this.lowerRunningAnimation.textureNumber.push(165);
		this.lowerRunningAnimation.textureNumber.push(168);
		this.lowerRunningAnimation.textureNumber.push(169);
		this.lowerRunningAnimation.timeToChange = 150;

		this.stunnedAnimation.textureNumber.push(170);
		this.stunnedEffect.textureNumber.push(170);
		this.stunnedAnimation.timeToChange;

		this.lowerJumpAnimation.textureNumber.push(160);
		this.upperJumpAnimation.textureNumber.push(161);

		this.lowerStillAnimation.textureNumber.push(165);
		this.upperStillAnimation.textureNumber.push(170);

		this.hp = hp;
		this.mana = mana;
		this.maxMana = this.mana;

		this.lowerAnimation = this.lowerIdleAnimation;
		this.upperAnimation = this.upperIdleAnimation;


	}

	public takeDamage(damage: number) {
		this.hp -= damage;

		if (this.hp <= 0) {
			this.hp = 0;
			this.deathType = DeathType.swordDeath;
		}
	}

	public useMana(mana: number) {

		if (this.mana - mana <= 0) {
			return false;
		}

		this.mana -= mana;

		return true;
	}

	public regenMana() {
		this.mana += this.manaRegen;

		if (this.mana > this.maxMana) {
			this.mana = this.maxMana;
		}
	}

	public getVelocity() {
		return new Vector(this.velocity.x + this.externalVelocity.x + this.liftVelocity.x, this.velocity.y + this.externalVelocity.y + this.liftVelocity.y);
	}

	public isMoving() {
		return this.velocity.x == 0;
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

		textureNumber = this.upperAnimation.getCurrentFrame();

		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, textureNumber);
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
		renderCall.vertecies.push.apply(renderCall.vertecies, call.vertecies);

		if (this.stunned) {
			renderCall = this.renderStunnedEffect(renderCall);
		}

		this.renderLower(renderCall);

		if (this.spellHandler.castingShield) {
			this.renderShield(renderCall);
			this.spellHandler.castingShield = false;
		}

		return renderCall;
	}

	public shieldExplosion(inverse: boolean) {
		this.particleHandler.createShieldExplosionEffect(this.getCalculatedPos(this.position, 0), this.inverse);
		this.stun();
		this.velocity.x = 0;
		if (inverse) {
			this.externalVelocity.x += 0.7;
		} else {
			this.externalVelocity.x -= 0.7;
		}
	}

	public getShieldCollidables() {
		if (this.spellHandler.castingShield) {
			return this.spellHandler.shieldCollidables;
		} else {
			return [];
		}

	}

	public renderLower(renderCall: RenderCall) {

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

		textureNumber = this.lowerAnimation.getCurrentFrame();

		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, textureNumber);
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
		renderCall.vertecies.push.apply(renderCall.vertecies, call.vertecies);

	}

	public update(tiles: Tile[], dynamicTiles: DynamicTile[], delta: number) {

		let collisionData = this.collisionDetection.collisionDetection(tiles, dynamicTiles, this, this.toMove, delta);

		if (this.lift == null) {
			this.fall(delta);
		} else {
			if (collisionData.groundCollision) {
				this.liftVelocity = new Vector(0, 0)
				this.lift = null;
			}
			collisionData.groundCollision = true;
			collisionData.normalY = -1;
		}

		if (collisionData.lift != null && collisionData.groundCollision && collisionData.normalY == -1) {
			this.lift = collisionData.lift;
		}

		if (this.deathType) {
			if (this.deathType == DeathType.swordDeath) {
				this.dead = true;
				this.projectileHandler.createPlayerSword_death(this.position, this.inverse);
			}
		}

		if (collisionData.groundCollision) {
			this.velocity.y = 0;

			if (collisionData.normalY == -1) {
				this.inJump = false;
				if (this.jumping) {
					this.liftVelocity = new Vector(0, 0)
					this.lift = null;
					this.idleTime = 0;
					this.velocity.y = this.jumpSpeed;
					this.inJump = true;
				}

				this.onGroundTimer = 50;

			} else if (this.onGroundTimer >= 0) {
				collisionData.fallDeath = true;
			}
		}

		if (collisionData.fallDeath) {
			this.dead = true;
			this.animationHandler.fallDeath(this.position);
		}

		if (collisionData.wallCollision) {
			this.velocity.x = 0;
			this.externalVelocity.x = 0;
		}

		if (this.velocity.x != 0 || collisionData.wallCollision) {
			this.idleTime = 0;
		} else {
			this.idleTime += delta;
			this.lowerRunningAnimation.reset();
			this.upperRunningAnimation.reset();
		}

		if (!this.moving) {
			if (this.externalVelocity.x != 0) {
				this.externalDrag.apply(this.externalVelocity, delta);
			} else {
				this.dragForce.apply(this.velocity, delta);
			}
		}

		this.spellHandler.update(delta);

		if (this.inJump) {
			this.lowerAnimation = this.lowerJumpAnimation;
		} else if (this.moving || this.velocity.x != 0) {
			this.lowerAnimation = this.lowerRunningAnimation;
		} else {
			this.lowerAnimation = this.lowerStillAnimation;
		}

		if (this.stunned) {
			this.stunnedAnimation.next(delta);
			this.stunnedEffect.next(delta);
			this.currentAnimation = this.stunnedAnimation;
			if (this.stunnedAnimation.repetitions == 0) {
				this.stunned = false;
			}
		} else if (this.spellHandler.currentCast) {
			if (this.spellHandler.currentCast instanceof ChannelCast) {
				this.lowerAnimation = this.spellHandler.currentCast.lowerCurrentAnimation;
			}

			this.upperAnimation = this.spellHandler.currentCast.currentAnimation;
		} else if (this.inJump) {
			this.upperAnimation = this.upperJumpAnimation;
		} else if (this.idleTime >= this.idleTimeChange) {
			this.lowerAnimation = this.lowerIdleAnimation;
			this.upperAnimation = this.upperIdleAnimation;
		} else if (this.moving || this.velocity.x != 0) {
			this.upperRunningAnimation.frameIndex = this.lowerRunningAnimation.frameIndex;
			this.upperRunningAnimation.lastChange = this.lowerRunningAnimation.lastChange;

			this.upperAnimation = this.upperRunningAnimation;
			this.lowerAnimation = this.lowerRunningAnimation;

		} else {
			this.upperAnimation = this.upperStillAnimation;
			this.lowerAnimation = this.lowerStillAnimation;
		}

		this.lowerAnimation.next(delta);
		this.upperAnimation.next(delta);

		this.jumping = false;
		this.moving = false;

		let totalVelocity = this.getVelocity();
		this.toMove.x = totalVelocity.x * delta;
		this.toMove.y = totalVelocity.y * delta;

		this.updateDamageAnimations();

		this.onGroundTimer -= delta;
	}

	public moveRight(delta: number) {
		super.moveRight(delta);
	}

	public moveLeft(delta: number) {
		super.moveLeft(delta);
	}

	public getCollisionArea() {
		var collisionArea = new Rectangle(this.position.x + 8, this.position.y + 14, 32, 68);

		return collisionArea;
	}

	public getProjectileCollisionArea() {
		var collisionArea = new Rectangle(this.position.x + 14, this.position.y + 14, 20, 72);

		return collisionArea;
	}

	public getCalculatedPos(position: Vector, size: number) {
		return new Vector(this.calcPos(position.x, size, 25), this.calcPos(position.y, size, 43))
	}

	public calcPos(value: number, size: number, offset: number) {
		return value - (size / 2 - offset);
	}

	public jump() {
		if (!this.jumping) {
			this.jumping = true;
		}
	}

	public cast(type: SpellType) {
		this.spellHandler.cast(type);
	}

	private renderShield(renderCall: RenderCall) {

		renderCall.vertecies =  this.renderHelper.getVertecies(this.position.x - 18, this.position.y - 5, 80, 100, renderCall.vertecies);
		renderCall.textureCoords.push.apply(renderCall.textureCoords, this.shieldTextureCoords);
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);

		return renderCall;
	}

	private stun() {
		this.stunned = true;
		this.stunnedAnimation.repetitions = 20;
		this.stunnedAnimation.reset();
	}

	private renderStunnedEffect(renderCall: RenderCall) {
		if (this.inverse) {
			renderCall.vertecies = this.renderHelper.getInverseVertecies(this.position.x, this.position.y - 8, 32, 32, renderCall.vertecies);
		} else {
			renderCall.vertecies = this.renderHelper.getVertecies(this.position.x + 13, this.position.y - 8, 32, 32, renderCall.vertecies);
		}
		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, this.stunnedEffect.getCurrentFrame());
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);

		return renderCall;
	}

	private updateDamageAnimations() {
		let removeItems: StickyAnimation[] = [];

		for (let stickyAnimation of this.damageAnimations) {
			stickyAnimation.animation.areaToRender.x = this.position.x - stickyAnimation.offset.x;
			stickyAnimation.animation.areaToRender.y = this.position.y - stickyAnimation.offset.y;

			if (stickyAnimation.animation.repetitions <= 0) {
				removeItems.push(stickyAnimation);
			}
		}

		for (let remove of removeItems) {
			let index = this.damageAnimations.indexOf(remove);

			if (index != -1) {
				this.damageAnimations.splice(index, 1);
			}
		}
	}

}