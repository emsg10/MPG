import { Projectile, Rectangle, Vector, Animation } from '../';
import { Gravity } from '../../forces/gravity';
import { Drag } from '../../forces/drag';

export class PhysicalProjectile extends Projectile {

    private gravityStrength: number = 0.0025;
    private gravity: Gravity = new Gravity(this.gravityStrength);
    private dragStrength = 0.0005;
    private drag: Drag = new Drag(this.dragStrength);

    constructor(velocity: Vector, area: Rectangle, animation: Animation, collisionRatio: number) {
        super(velocity, area, animation, collisionRatio);
    }

    public update(travelDistanceX: number, travelDistanceY: number, delta: number) {

        this.gravity.apply(this.velocity, delta);
        this.drag.apply(this.velocity, delta);

        super.update(travelDistanceX, travelDistanceY, delta);

        
    }
}