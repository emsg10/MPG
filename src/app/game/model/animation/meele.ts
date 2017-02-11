import { Projectile, Vector, Rectangle, Animation } from '../'

export class Meele extends Projectile{
    constructor(velocity: Vector, area: Rectangle, animation: Animation, collisionRatio: number) {
        super(velocity, area, animation, collisionRatio);
    }

    update(travelDistanceX: number, travelDistanceY: number, delta: number) {
        super.update(travelDistanceX, travelDistanceY, delta);
    }
}