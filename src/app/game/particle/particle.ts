import { Rectangle, Vector } from '../model';

export class Particle {

    public position: Vector;
    public size: number;
    public lifeTime: number;
    public velocity: Vector;
    public growth: number;

    constructor(position: Vector, size: number, lifeTime: number, velocity: Vector, growth: number) {
        this.position = position;
        this.size = size;
        this.lifeTime = lifeTime;
        this.velocity = velocity;
        this.growth = growth;
    }

}