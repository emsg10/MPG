import { Projectile, Rectangle, Vector, Animation, DebugElement, RotationAnimation } from '../';
import { Gravity } from '../../forces/gravity';
import { Drag } from '../../forces/drag';
import { DebugHandler } from '../../handler/debugHandler';

export class PhysicalProjectile extends Projectile {

    private gravityStrength: number = 0.0025;
    public gravity: Gravity = new Gravity(this.gravityStrength);
    private dragStrength = 0.0005;
    public drag: Drag = new Drag(this.dragStrength);

    private angle: boolean;

    constructor(velocity: Vector, area: Rectangle, animation: Animation, collisionRatio: number, collisionArea?: Rectangle, angle?: boolean) {
        super(velocity, area, animation, collisionRatio, collisionArea);

        this.angle = angle;
    }

    public update(travelDistanceX: number, travelDistanceY: number, delta: number) {
        super.update(travelDistanceX, travelDistanceY, delta); 
    }

    public updateForces(delta: number) {
        this.gravity.apply(this.velocity, delta);
        this.drag.apply(this.velocity, delta);
    }
}