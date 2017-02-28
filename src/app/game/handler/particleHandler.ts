import { Particle } from '../particle/particle'
import { Vector } from '../model';
import { RenderHelper } from '../render/renderHelper';

export class ParticleHandler {

    public particles: Particle[] = [];
    private renderHelper = RenderHelper.getInstance();

    constructor() {
    }

    public createFrostBlast(position: Vector, inverse: boolean) {

        let relativePos: Vector;
        if (inverse) {
            relativePos = this.renderHelper.getRelativeValue(position.x + 5, position.y + 30);
        } else {
            relativePos = this.renderHelper.getRelativeValue(position.x + 40, position.y + 30);
        }

        for (let i = 0; i < 30; i++) {

            let lifeTime = Math.random() * 0.8;
            let startPositions: number[] = [];
            let endPositions: number[] = [];
            startPositions.push((relativePos.x));
            startPositions.push((relativePos.y) + (Math.random() * 0.01));
            startPositions.push(0);

            if(inverse) {
                endPositions.push(-0.8 + (Math.random() * 0.1));    
            } else {
                endPositions.push(0.8 - (Math.random() * 0.1));
            }

            endPositions.push(0 - (Math.random() * 0.07));
            endPositions.push(0);
            

            this.particles.push(new Particle(startPositions, endPositions, lifeTime));
        }
    }

}