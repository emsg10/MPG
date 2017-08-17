import { Projectile, Vector, Rectangle, Animation, SpellType } from '../'

export class ParticleProjectile extends Projectile {

    public distance: number;
    public inverse: boolean;
    private onUpdate: (area: Rectangle, inverse: boolean, offsetX: number) => void;
    private offset: number;

    constructor(velocity: Vector, area: Rectangle, animation: Animation, collisionRatio: number, distance: number, inverse: boolean, offset: number, onUpdate: (area: Rectangle, inverse: boolean, offsetX: number) => void, collisionArea?: Rectangle) {
        super(velocity, area, animation, collisionRatio, collisionArea);

        this.onUpdate = onUpdate;
        this.distance = distance;
        this.inverse = inverse;
        this.offset = offset;
    }

    public update(travelDistanceX: number, travelDistanceY: number, delta: number) {

        super.update(travelDistanceX, travelDistanceY, delta);

        this.onUpdate(this.area, this.inverse, this.offset);
        this.distance -= Math.abs(travelDistanceX); 
    }

}