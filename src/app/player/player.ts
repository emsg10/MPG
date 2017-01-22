import { Vector, Rectangle, Sprite } from '../../model';
import { RenderCall } from '../render/renderCall';
import { Animate } from '../render/animate';
import { Context } from '../';
import { CollisionData } from '../collision';

import { Gravity } from '../forces/gravity';

export class Player {

	public position: Vector;
	public velocity: Vector = new Vector(0, 0);
	public toMove: Vector = new Vector(0, 0);
	public defaultJumpSpeed: number = -0.7;
	public jumpSpeed: number = this.defaultJumpSpeed;
	public dead: boolean = false;

	private maxSpeed: number = 0.3;
	private drag: number = 0.0015;
	private acceleration: number = 0.009;
	private gravityStrength: number = 0.0025;
	private context: Context;
	private runningAnimation: Animate = new Animate();
	private idleAnimation: Animate = new Animate();
	private idleTime = 3000;
	private idleTimeChange = 3000;
	private inverse: boolean = false;
	private moving: boolean = false;
	private spriteSizeX: number;
	private spriteSizeY: number;
	private lastStablePosition: Vector;
	private gravity: Gravity = new Gravity(this.gravityStrength);
	private jumping: boolean = false;

	constructor(position: Vector, context: Context, spriteSizeX: number, spriteSizeY: number) {
		this.position = position;
		this.lastStablePosition = new Vector(this.position.x, this.position.y);
		this.context = context;

		this.spriteSizeX = spriteSizeX;
		this.spriteSizeY = spriteSizeY;

		this.idleAnimation.frames.push(new Sprite(new Rectangle(0, 290, 28, 29)));

		this.runningAnimation.frames.push(new Sprite(new Rectangle(28, 293, 28, 26)));
		this.runningAnimation.frames.push(new Sprite(new Rectangle(56, 293, 28, 26)));
		this.runningAnimation.frames.push(new Sprite(new Rectangle(84, 293, 28, 26)));

	}

	public createRenderCall() {

		let call = new RenderCall();
		let x: number = this.position.x;
		let x1: number;
		let x2: number;
		let frame: Sprite;
		
		if(this.inverse) {
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

		if(this.idleTime >= this.idleTimeChange) {
			frame = this.idleAnimation.getCurrentFrame();
		} else {
			frame = this.runningAnimation.getCurrentFrame();
		}

		let tx1 = frame.position.x/512;
		let ty1 = frame.position.y/512;
		let tx2 = (frame.position.x + frame.position.width)/512;
		let ty2 = (frame.position.y + frame.position.height)/512;


		call.textureCoords = [
			tx1,  ty1,
		    tx2,  ty2,
		    tx2,  ty1,
		    tx1,  ty1,
		    tx2,  ty2,
		    tx1,  ty2,
		];
		call.indecies = [0, 1, 2, 3, 4, 5];

		return call;

	}



	public update(collisionData: CollisionData, delta: number) {

		let deltaDrag = delta * this.drag;

		if(collisionData.groundCollision) {
			this.velocity.y = 0;

			if(collisionData.normalY == -1) {
				if(this.jumping) {
					this.idleTime = 0;
					this.velocity.y = this.jumpSpeed;
				}	
			}
		}

		if(collisionData.wallCollision) {
			this.velocity.x = 0;
		}
		
		if(this.velocity.x != 0 || collisionData.wallCollision) {
			this.idleTime = 0;
			this.runningAnimation.next(delta);	
		} else {
			this.idleTime += delta;
		}

		if(!this.moving) {
			if(this.velocity.x > 0) {
				this.velocity.x -= deltaDrag;
				if(this.velocity.x < deltaDrag) {
					this.velocity.x = 0;
				}
			} else if(this.velocity.x < 0) {
				this.velocity.x += deltaDrag;
				if(this.velocity.x > deltaDrag) {
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
		if(this.velocity.x < this.maxSpeed) {
			this.velocity.x += this.acceleration * delta;
		} 

		if(this.velocity.x > this.maxSpeed) {
			this.velocity.x = this.maxSpeed;
		}

		this.inverse = false;
		this.moving = true;
	}

	public moveLeft(delta: number) {
		
		if(this.velocity.x > -this.maxSpeed) {
			this.velocity.x -= this.acceleration * delta;
		} 

		if(this.velocity.x < this.maxSpeed) {
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
		if(!this.jumping) {
			this.jumping = true;
		}
		
	}

}