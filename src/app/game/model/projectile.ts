import { Vector, Rectangle, Animation, SpellType } from '../model';

export class Projectile {
    public velocity: Vector;
    public area: Rectangle;
    public collisionArea: Rectangle;
    public animation: Animation;
    public distance: number;
    public type: SpellType;

    constructor(velocity: Vector, area: Rectangle, animation: Animation, distance: number, collisionRatio: number, type: SpellType) {
        this.velocity = velocity;
        this.area = area;
        this.animation = animation;
        this.distance = distance;
        this.type = type;
        this.collisionArea = new Rectangle(this.area.x + (this.area.width/2) - ((this.area.width * collisionRatio)/2), this.area.y + (this.area.height/2) - ((this.area.height * collisionRatio)/2), this.area.width * collisionRatio, this.area.height * collisionRatio);
    }

    public update(travelDistanceX: number, travelDistanceY: number) {

        this.animation.areaToRender.x = this.area.x;
        this.animation.areaToRender.y = this.area.y;

        this.collisionArea.x += travelDistanceX;
        this.collisionArea.y += travelDistanceY;

        this.distance -= Math.abs(travelDistanceX); 
    }

}