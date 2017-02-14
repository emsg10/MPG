import { Vector, Animation, Rectangle } from '../model';
import { Gravity } from '../forces/gravity';

export abstract class Character {
    public position: Vector;
	public velocity: Vector = new Vector(0, 0);
	public toMove: Vector = new Vector(0, 0);
    public dead: boolean = false;
	public inverse: boolean = false;
	public width: number;
	public height: number;
    public currentAnimation: Animation = new Animation();
    protected maxSpeed: number = 0.3;
    protected acceleration: number = 0.009;
	protected moving: boolean = false;
    protected gravityStrength: number = 0.0025;
    protected gravity: Gravity = new Gravity(this.gravityStrength);

    constructor(position: Vector, width: number, height: number) {
        this.position = position;
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

	public getCollisionArea() {
		var collisionArea = new Rectangle(this.position.x, this.position.y, this.width, this.height);

		return collisionArea;
	}
}