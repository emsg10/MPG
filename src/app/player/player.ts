import { Vector } from '../../model';
import { RenderCall } from '../render/renderCall';
import { Animate } from '../render/animate';
import { Context } from '../';

export class Player {

	public position: Vector;
	private context: Context;
	private runningAnimation: Animate = new Animate();
	private inverse: boolean = false;
	private velocity: Vector = new Vector(0, 0);
	private drag: number = 0.2;
	private moving: boolean = false;

	constructor(position: Vector, context: Context) {
		this.position = position;
		this.context = context;

		//this.animate.frames.push(new Point(1, 282));
		this.runningAnimation.frames.push(new Vector(28, 282));
		this.runningAnimation.frames.push(new Vector(55, 282));
		this.runningAnimation.frames.push(new Vector(85, 282));

	}

	public createRenderCall() {

		var call = new RenderCall();
		var x: number = this.position.x;
		var x1: number;
		var x2: number;
		
		if(this.inverse) {
			x2 = x - 21;
			x1 = x + 21;
		} else {
			x2 = x + 21;
			x1 = x - 21;
		}
  		
  		var y1 = this.position.y;
  		var y2 = this.position.y + 50;

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

}