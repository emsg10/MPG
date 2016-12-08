import { Vector, Rectangle } from '../../model';
import { RenderCall } from '../render/renderCall';
import { Animate } from '../render/animate';
import { Context } from '../';
import { Gravity } from '../forces/gravity';

export class Player {

	public position: Vector;
	public defaultJumpSpeed: number = -8;
	public jumpSpeed: number = this.defaultJumpSpeed;
	private context: Context;
	private runningAnimation: Animate = new Animate();
	private inverse: boolean = false;
	private velocity: Vector = new Vector(0, 0);
	private drag: number = 0.4;
	private moving: boolean = false;
	private spriteSizeX: number;
	private spriteSizeY: number;
	private lastStablePosition: Vector;
	private gravity: Gravity = new Gravity();
	private jumping: boolean = false;

	constructor(position: Vector, context: Context, spriteSizeX: number, spriteSizeY: number) {
		this.position = position;
		this.lastStablePosition = new Vector(this.position.x, this.position.y);
		this.context = context;

		this.spriteSizeX = spriteSizeX;
		this.spriteSizeY = spriteSizeY;

		//this.animate.frames.push(new Point(1, 282));
		this.runningAnimation.frames.push(new Vector(28, 280));
		this.runningAnimation.frames.push(new Vector(55, 280));
		this.runningAnimation.frames.push(new Vector(85, 280));

	}

	public createRenderCall() {

		var call = new RenderCall();
		var x: number = this.position.x;
		var x1: number;
		var x2: number;
		
		if(this.inverse) {
			x2 = x - (this.spriteSizeX / 2);
			x1 = x + (this.spriteSizeX / 2);
		} else {
			x2 = x + (this.spriteSizeX / 2);
			x1 = x - (this.spriteSizeX / 2);
		}
  		
  		var y1 = this.position.y - (this.spriteSizeY / 2);
  		var y2 = this.position.y + (this.spriteSizeY / 2);

		call.context = this.context;

		call.vertecies = [
			x1, y1,
     		x2, y2,
     		x2, y1,
     		x1, y1,
     		x2, y2,
     		x1, y2
		];

		var relX = this.runningAnimation.getCurrentFrame().x/512;
		var relY = this.runningAnimation.getCurrentFrame().y/512;		

		call.textureCoords = [
			relX,  relY,
		    (relX + 0.05),  (relY + 0.06),
		    (relX + 0.05),  relY,
		    relX,  relY,
		    (relX + 0.05),  (relY + 0.06),
		    relX,  (relY + 0.06),
		];
		call.indecies = [0, 1, 2, 3, 4, 5];

		return call;

	}

	public update() {
		this.position.add(this.velocity);
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

		this.moving = false;
	}

	public moveRight() {
		if(this.velocity.x < 3) {
			this.velocity.x += 0.5;
		}
		this.inverse = false;
		this.moving = true;
	}

	public moveLeft() {
		
		if(this.velocity.x > -3) {
			this.velocity.x -= 0.5;
		}
		this.inverse = true;
		this.moving = true;
	}

	public getCollisionArea() {
		var collision = new Rectangle();

		collision.width = this.spriteSizeX;
		collision.height = this.spriteSizeY;
		collision.x = this.position.x;
		collision.y = this.position.y;

		return collision;
	}

	public wallCollision() {
		this.position.x -= this.velocity.x;
		this.velocity.x = 0;
	}



	public fall() {
		this.gravity.apply(this.velocity);
	}

	public groundCollision() {
		let groundCollision = this.velocity.y > 0;

		this.position.y -= this.velocity.y;
		this.velocity.y = 0;

		return groundCollision;
	}

	public getNextCollisionArea(row: boolean) {
		if(row) {
			this.position.x += this.velocity.x;
		} else {
			this.position.y += this.velocity.y;
		}
		
		return this.getCollisionArea();
	}

	public jump() {
		if(!this.jumping) {
			this.velocity.y = this.jumpSpeed;
			this.jumping = true;
		}
		
	}

	public resetJump() {
		this.jumping = false;
	}

}