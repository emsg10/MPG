import { Projectile, Vector, Rectangle, Animation, SpellType } from '../'

export class Spell extends Projectile {

    public distance: number;
    public type: SpellType;

    constructor(velocity: Vector, area: Rectangle, animation: Animation, collisionRatio: number, distance: number, type: SpellType) {
        super(velocity, area, animation, collisionRatio);

        this.distance = distance;
        this.type = type;
    }

    public update(travelDistanceX: number, travelDistanceY: number, delta: number) {

        super.update(travelDistanceX, travelDistanceY, delta);

        this.distance -= Math.abs(travelDistanceX); 
    }

}