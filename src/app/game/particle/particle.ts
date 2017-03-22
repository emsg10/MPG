import { Rectangle, Vector } from '../model';

export class Particle {

    public area: Rectangle;
    public lifeTime: number;
    public velocity: Vector;
    public growth: number;
    public dead: boolean;

    constructor(area: Rectangle, lifeTime: number, velocity: Vector, growth: number) {
        this.area = area;
        this.lifeTime = lifeTime;
        this.velocity = velocity;
        this.growth = growth;
    }

}