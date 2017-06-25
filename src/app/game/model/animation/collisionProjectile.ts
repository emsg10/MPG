import { Projectile, Vector, Rectangle, Animation, SpellType } from '../'

export class CollisionProjectile extends Projectile {

    public distance: number;

    constructor(velocity: Vector, area: Rectangle, distance: number, animation: Animation, damage: number) {
        super(velocity, area, animation, 1);
        this.damage = damage;
        this.distance = distance;
    }

    public update(travelDistanceX: number, travelDistanceY: number, delta: number) {
        super.update(travelDistanceX, travelDistanceY, delta);

        this.distance -= Math.abs(travelDistanceX); 
    }

}