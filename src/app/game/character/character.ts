import { Vector, Animation } from '../model';
import { Context } from '../context';
import { Gravity } from '../forces/gravity';

export class Character {
    public position: Vector;
	public velocity: Vector = new Vector(0, 0);
	public toMove: Vector = new Vector(0, 0);
    public dead: boolean = false;
    protected runningAnimation: Animation = new Animation();
    protected context: Context;
    protected width: number;
	protected height: number;
    protected maxSpeed: number = 0.3;
    protected acceleration: number = 0.009;
    protected inverse: boolean = false;
	protected moving: boolean = false;
    protected gravityStrength: number = 0.0025;
    protected gravity: Gravity = new Gravity(this.gravityStrength);

    constructor(position: Vector, context: Context, width: number, height: number) {
        this.position = position;
        this.context = context;
        this.width = width;
        this.height = height;
    }

    public moveRight(delta: number) {

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
        if (this.velocity.x > -this.maxSpeed) {
			this.velocity.x -= this.acceleration * delta;
		}

		if (this.velocity.x < this.maxSpeed) {
			this.velocity.x = -this.maxSpeed;
		}

		this.inverse = true;
		this.moving = true;
    }

    public fall(delta: number) {
		this.gravity.apply(this.velocity, delta);
	}
}