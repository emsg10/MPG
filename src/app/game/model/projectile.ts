import { Vector, Rectangle, Animation } from '../model';

export class Projectile {
    public velocity: Vector;
    public area: Rectangle;
    public animation: Animation;
    public distance: number;

    constructor(velocity: Vector, area: Rectangle, animation: Animation, distance: number) {
        this.velocity = velocity;
        this.area = area;
        this.animation = animation;
        this.distance = distance;
    }

    public update(delta: number) {
        let travelDistanceX = this.velocity.x * delta;
        this.area.x += travelDistanceX;
        this.area.y += this.velocity.y * delta;
        this.animation.areaToRender.x = this.area.x;
        this.animation.areaToRender.y = this.area.y;

        this.distance -= Math.abs(travelDistanceX); 
    }

}