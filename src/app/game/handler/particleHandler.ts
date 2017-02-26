import { Particle } from '../particle/particle'

export class ParticleHandler {

    public particles: Particle[] = [];

    constructor() {
    }

    public createFrostBlast() {
        for(let i = 0; i < 10; i++) {

            let lifeTime = Math.random();
            let startPositions: number[] = [];
            let endPositions: number[] = [];
			startPositions.push((0.5 * 0.25) - 0.125);
			startPositions.push((0.5 * 0.25) - 0.125);
			startPositions.push((0.5 * 0.25) - 0.125);

			endPositions.push(1 - (Math.random() * 0.1));
			endPositions.push(0 - (Math.random() * 0.1));
			endPositions.push(1);

            this.particles.push(new Particle(startPositions, endPositions, lifeTime));
        }
    }

}