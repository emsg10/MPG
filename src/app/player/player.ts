import { Vector, Rectangle, Sprite } from '../../model';
import { RenderCall } from '../render/renderCall';
import { Animate } from '../render/animate';
import { Context } from '../';
import { CollisionData } from '../collision';

import { Gravity } from '../forces/gravity';

export class Player {

	public position: Vector;
	public defaultJumpSpeed: number = -10;
	public jumpSpeed: number = this.defaultJumpSpeed;
	public velocity: Vector = new Vector(0, 0);
	private maxSpeed: number = 6;
	private context: Context;
	private runningAnimation: Animate = new Animate();
	private inverse: boolean = false;
	private drag: number = 0.8;
	private moving: boolean = false;
	private spriteSizeX: number;
	private spriteSizeY: number;
	private lastStablePosition: Vector;
	private gravity: Gravity = new Gravity();
	private jumping: boolean = false;
	private idleSprite: Sprite;

	constructor(position: Vector, context: Context, spriteSizeX: number, spriteSizeY: number) {
		this.position = position;
		this.lastStablePosition = new Vector(this.position.x, this.position.y);
		this.context = context;

		this.spriteSizeX = spriteSizeX;
		this.spriteSizeY = spriteSizeY;

		this.idleSprite = new Sprite(new Rectangle(0, 292, 28, 30));
		//this.animate.frames.push(new Point(1, 282));
		this.runningAnimation.frames.push(new Sprite(new Rectangle(28, 292, 28, 28)));
		this.runningAnimation.frames.push(new Sprite(new Rectangle(56, 292, 28, 28)));
		this.runningAnimation.frames.push(new Sprite(new Rectangle(84, 292, 28, 28)));

	}

	public createRenderCall() {

		var call = new RenderCall();
		var x: number = this.position.x;
		var x1: number;
		var x2: number;
		
		if(this.inverse) {
			x2 = x;
			x1 = x + (this.spriteSizeX);
		} else {
			x2 = x + (this.spriteSizeX);
			x1 = x;
		}
  		
  		var y1 = this.position.y;
  		var y2 = this.position.y + (this.spriteSizeY);

		call.context = this.context;

		call.vertecies = [
			x1, y1,
     		x2, y2,
     		x2, y1,
     		x1, y1,
     		x2, y2,
     		x1, y2
		];

		var x1 = this.runningAnimation.getCurrentFrame().position.x/512;
		var y1 = this.runningAnimation.getCurrentFrame().position.y/512;
		var x2 = (this.runningAnimation.getCurrentFrame().position.x + this.runningAnimation.getCurrentFrame().position.width)/512;
		var y2 = (this.runningAnimation.getCurrentFrame().position.y + this.runningAnimation.getCurrentFrame().position.height)/512;


		call.textureCoords = [
			x1,  y1,
		    x2,  y2,
		    x2,  y1,
		    x1,  y1,
		    x2,  y2,
		    x1,  y2,
		];
		call.indecies = [0, 1, 2, 3, 4, 5];

		return call;

	}


	public update(collisionData: CollisionData) {

		if(collisionData.groundCollision) {
			this.velocity.y = 0;

			if(collisionData.normalY == -1) {
				if(this.jumping) {
					this.velocity.y = this.jumpSpeed;
				}	
			}
		}

		if(collisionData.wallCollision) {
			this.velocity.x = 0;
		}
		
		if(this.velocity.x != 0) {
			this.runningAnimation.next();	
		}
		if(!this.moving) {
			if(this.velocity.x > 0) {
				this.velocity.x -= this.drag;
				if(this.velocity.x < this.drag) {
					this.velocity.x = 0;
				}
			} else if(this.velocity.x < 0) {
				this.velocity.x += this.drag;
				if(this.velocity.x > this.drag) {
					this.velocity.x = 0;
				}
			}	
		}

		this.jumping = false;
		this.moving = false;
	}

	public moveRight() {
		if(this.velocity.x < this.maxSpeed) {
			this.velocity.x += 0.5;
		}
		this.inverse = false;
		this.moving = true;
	}

	public moveLeft() {
		
		if(this.velocity.x > -this.maxSpeed) {
			this.velocity.x -= 0.5;
		}
		this.inverse = true;
		this.moving = true;
	}

	public getCollisionArea() {
		var collisionArea = new Rectangle(this.position.x, this.position.y, 55, 51);

		return collisionArea;
	}

	public fall() {
		this.gravity.apply(this.velocity);
	}

	public jump() {
		if(!this.jumping) {
			this.jumping = true;
		}
		
	}

}