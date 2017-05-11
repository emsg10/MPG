import { Vector, Rectangle, Sprite, Animation, SpellType, StickyAnimation, DebugElement } from '../model';
import { RenderCall } from '../render/renderCall';
import { RenderHelper } from '../render/renderHelper';
import { Context } from '../';
import { CollisionData } from '../collision';
import { ProjectileHandler } from '../handler/projectileHandler';
import { AnimationHandler } from '../handler/animationHandler';
import { ParticleHandler } from '../handler/particleHandler';
import { SpellHandler } from '../handler/spellHandler';
import { Drag } from '../forces/drag';
import { Character } from './character';
import { DeathType } from './deathType';
import { DebugHandler } from '../handler/debugHandler';

export class Player extends Character{

	public defaultJumpSpeed: number = -0.7;
	public jumpSpeed: number = this.defaultJumpSpeed;
	public damageAnimations: StickyAnimation[] = [];
	public hp: number;
	public mana: number;
	public stunned = false;
	private projectileHandler: ProjectileHandler;
	private animationHandler: AnimationHandler;
	private particleHandler: ParticleHandler;
	private spellHandler: SpellHandler;
	private drag: number = 0.0015;
	private externalDragForce: number = 0.0001;
	private dragForce: Drag = new Drag(this.drag);
	private externalDrag = new Drag(this.externalDragForce);
	private idleAnimation: Animation = new Animation();
	private stunnedAnimation: Animation = new Animation();
	private stunnedEffect: Animation = new Animation();
	private idleTime = 3000;
	private idleTimeChange = 3000;
	private jumping: boolean = false;
	private renderHelper = RenderHelper.getInstance();
	private context: Context;
	private runningAnimation = new Animation();
	private manaRegen = 1;
	private maxMana: number;
	private externalVelocity: Vector = new Vector(0, 0);

	private debugHandler = DebugHandler.getInstance();

	constructor( position: Vector, context: Context, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler, particleHandler: ParticleHandler, width: number, height: number, hp:number, mana: number) {
		super(position, width, height);
		this.context = context;
		this.projectileHandler = projectileHandler;
		this.animationHandler = animationHandler;
		this.particleHandler = particleHandler;
		this.spellHandler = new SpellHandler(this.animationHandler, this.projectileHandler, this.particleHandler, this);
		this.currentAnimation = this.idleAnimation;
		
		this.hp = hp;
		this.mana = mana;
		this.maxMana = this.mana;

		this.idleAnimation.textureNumber.push(203);

		this.runningAnimation.textureNumber.push(200);
		this.runningAnimation.textureNumber.push(201);
		this.runningAnimation.textureNumber.push(202);

		this.stunnedAnimation.textureNumber.push(296);
		this.stunnedAnimation.textureNumber.push(294);
		this.stunnedAnimation.textureNumber.push(296);
		this.stunnedAnimation.textureNumber.push(295);
		this.stunnedAnimation.timeToChange = 200;

        this.stunnedEffect.textureNumber.push(297);
        this.stunnedEffect.textureNumber.push(298);
        this.stunnedEffect.textureNumber.push(299);
		this.stunnedEffect.timeToChange = 200;

		
	}

	public takeDamage(damage: number) {
		this.hp -= damage;

		if(this.hp <= 0) {
			this.hp = 0;
			this.deathType = DeathType.swordDeath;
		}
	}

	public useMana(mana: number) {

		if(this.mana - mana <= 0) {
			return false;
		}

		this.mana -= mana;

		return true;
	}

	public regenMana() {
		this.mana += this.manaRegen;

		if(this.mana > this.maxMana) {
			this.mana = this.maxMana;
		}
	}

	public getVelocity() {
		return new Vector(this.velocity.x + this.externalVelocity.x, this.velocity.y + this.externalVelocity.y);
	}

	public isMoving() {
		return this.velocity.x == 0;
	}

	public createRenderCall(renderCall: RenderCall, camera: Vector) {

		let call = new RenderCall();
		let x: number = this.position.x - camera.x;
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

		let y1 = this.position.y - camera.y;
		let y2 = this.position.y + (this.height) - camera.y;

		call.vertecies = [
			x1, y1,
			x2, y2,
			x2, y1,
			x1, y1,
			x2, y2,
			x1, y2
		];

		textureNumber = this.currentAnimation.getCurrentFrame();

		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, textureNumber);
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
		renderCall.vertecies.push.apply(renderCall.vertecies, call.vertecies)
		renderCall.color = this.renderHelper.getColor(renderCall.color, null);

		if(this.spellHandler.castingShield) {
			renderCall = this.renderShield(renderCall, camera);
			this.spellHandler.castingShield = false;
		}

		if(this.stunned) {
			renderCall = this.renderStunnedEffect(renderCall, camera);
		}

		return renderCall;
	}

	public update(collisionData: CollisionData, delta: number) {

		if(this.deathType) {
			if(this.deathType == DeathType.swordDeath) {
				this.dead = true;
				this.projectileHandler.createPlayerSword_death(this.position, this.inverse);
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
			this.externalVelocity.x = 0;
		}

		if (this.velocity.x != 0 || collisionData.wallCollision) {
			this.idleTime = 0;
			this.runningAnimation.next(delta);
		} else {
			this.idleTime += delta;
		}

		if (!this.moving) {
			if(this.externalVelocity.x > 0) {
				this.externalDrag.apply(this.externalVelocity, delta);
			} else {
				this.dragForce.apply(this.velocity, delta);
			}
		}

		this.spellHandler.update(delta);

		if(this.stunned) {
			this.stunnedAnimation.next(delta);
			this.stunnedEffect.next(delta);
			this.currentAnimation = this.stunnedAnimation;
			if(this.stunnedAnimation.repetitions == 0) {
				this.stunned = false;
			}
		} else if(this.spellHandler.currentCast) {
			this.currentAnimation = this.spellHandler.currentCast.currentAnimation;
		} else if (this.idleTime >= this.idleTimeChange) {
			this.currentAnimation = this.idleAnimation;
		} else {
			this.currentAnimation = this.runningAnimation;
		}

		this.fall(delta);
		this.jumping = false;
		this.moving = false;

		let totalVelocity = this.getVelocity();
		this.toMove.x = totalVelocity.x * delta;
		this.toMove.y = totalVelocity.y * delta;

		this.updateDamageAnimations();
				
	}

	public moveRight(delta: number) {
		super.moveRight(delta);
	}

	public moveLeft(delta: number) {
		super.moveLeft(delta);
	}

	public getCollisionArea() {
		var collisionArea = new Rectangle(this.position.x, this.position.y, 43, 42);

		return collisionArea;
	}

	public getProjectileCollisionArea() {
		var collisionArea = new Rectangle(this.position.x + 10, this.position.y + 5, 43 - 10, 42 - 5);

		return collisionArea;
	}

	public getShieldCollidables() {
		if(this.spellHandler.castingShield) {
			return this.spellHandler.shieldCollidables;
		} else {
			return [];
		}
		
	}

	public shieldExplosion() {
		this.particleHandler.createShieldExplosionEffect(this.getCalculatedPos(this.position, 0), this.inverse);
		this.stun();
		if(this.inverse) {
			this.externalVelocity.x += 0.5;
		} else {
			this.externalVelocity.x -= 0.5;
		}
	}

	public getCalculatedPos(position: Vector, size: number) {
        return new Vector(this.calcPos(position.x, size, 22), this.calcPos(position.y, size, 25))
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

	private stun() {
		this.stunned = true;
		this.stunnedAnimation.repetitions = 20;
		this.stunnedAnimation.reset();
	}

	private renderShield(renderCall: RenderCall, camera: Vector) {

		if(this.inverse) {
			renderCall.vertecies =  this.renderHelper.getInverseVertecies(this.position.x - 15 - camera.x, this.position.y - camera.y - 20, 60, 80, renderCall.vertecies);
		} else {
			renderCall.vertecies =  this.renderHelper.getVertecies(this.position.x - camera.x, this.position.y - camera.y - 20, 60, 80, renderCall.vertecies);
		}
		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, 300);
		renderCall.color = this.renderHelper.getColor(renderCall.color, this.renderHelper.getIndeciesAttribute([0, 0.2, 1, 0.8]));
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);

        return renderCall;
	}

	private renderStunnedEffect(renderCall: RenderCall, camera: Vector) {
		if(this.inverse) {
			renderCall.vertecies =  this.renderHelper.getInverseVertecies(this.position.x - camera.x, this.position.y - camera.y - 8, 32, 32, renderCall.vertecies);
		} else {
			renderCall.vertecies =  this.renderHelper.getVertecies(this.position.x - camera.x + 13, this.position.y - camera.y - 8, 32, 32, renderCall.vertecies);
		}
		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, this.stunnedEffect.getCurrentFrame());
		renderCall.color = this.renderHelper.getColor(renderCall.color, null);
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);

        return renderCall;
	}

	private updateDamageAnimations() {
		let removeItems: StickyAnimation[] = [];
		
		for(let stickyAnimation of this.damageAnimations) {
			stickyAnimation.animation.areaToRender.x = this.position.x - stickyAnimation.offset.x;
			stickyAnimation.animation.areaToRender.y = this.position.y - stickyAnimation.offset.y;

			if(stickyAnimation.animation.repetitions <= 0) {
				removeItems.push(stickyAnimation);
			}
		}

		for(let remove of removeItems) {
			let index = this.damageAnimations.indexOf(remove);

			if(index != -1) {
				this.damageAnimations.splice(index, 1);
			}
		}
	}

}