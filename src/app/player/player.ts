import { Vector, Rectangle } from '../../model';
import { RenderCall } from '../render/renderCall';
import { Animate } from '../render/animate';
import { Context } from '../';
import { Gravity } from '../forces/gravity';

export class Player {

	public position: Vector;
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
		this.lastStablePosition = this.lastStablePosition.copy(this.position);
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
		if(this.velocity.x < 6) {
			this.velocity.x += 0.5;
		}
		this.inverse = false;
		this.moving = true;
	}

	public moveLeft() {
		
		if(this.velocity.x > -6) {
			this.velocity.x -= 0.5;
		}
		this.inverse = true;
		this.moving = true;
	}

	public getCollisionBox() {
		var collisionBox = new Rectangle(); 

		collisionBox.width = this.spriteSizeX;
		collisionBox.height = this.spriteSizeY;
		collisionBox.x = this.position.x - (this.spriteSizeX / 2);
		collisionBox.y = this.position.y + (this.spriteSizeY / 2);

		return collisionBox;
	}

	public revertPosition() {
		this.position = this.lastStablePosition;
	}

	public fall() {
		this.gravity.apply(this.velocity);
	}

	public onGround() {
		this.position = this.lastStablePosition;
		this.velocity.y = 0;
		this.jumping = false;
	}

	public jump() {
		if(!this.jumping) {
			this.velocity.y = -10;
			this.jumping = true;
		}
		
	}

}