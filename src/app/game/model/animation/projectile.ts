import { Vector, Rectangle, Animation, SpellType, ProjectileType } from '../';

export abstract class Projectile {
    public velocity: Vector;
    public area: Rectangle;
    public collisionArea: Rectangle;
    public animation: Animation;
    public projectileType: ProjectileType = ProjectileType.None;

    constructor(velocity: Vector, area: Rectangle, animation: Animation, collisionRatio: number, collisionArea?: Rectangle) {
        this.velocity = velocity;
        this.area = area;
        this.animation = animation;
        if(collisionArea) {
            this.collisionArea = collisionArea;
        } else {
            this.collisionArea = new Rectangle(this.area.x + (this.area.width/2) - ((this.area.width * collisionRatio)/2), this.area.y + (this.area.height/2) - ((this.area.height * collisionRatio)/2), this.area.width * collisionRatio, this.area.height * collisionRatio);
        }
    }

    public update(travelDistanceX: number, travelDistanceY: number, delta: number) {

        this.area.x += travelDistanceX;
        this.area.y += travelDistanceY;

        this.collisionArea.x += travelDistanceX;
        this.collisionArea.y += travelDistanceY;

        this.animation.areaToRender.x = this.area.x;
        this.animation.areaToRender.y = this.area.y;
    }

    public updateForces(delta: number) {

    }

}