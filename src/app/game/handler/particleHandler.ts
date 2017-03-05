import { Particle } from '../particle/particle'
import { Vector, Tile, Rectangle, DebugElement } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { CollisionDetection } from '../collision/collisionDetection';
import { DebuggHandler } from './debugHandler';

export class ParticleHandler {

    public particles: Particle[] = [];
    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();
    private tiles: Tile[];
    private relativeParticleEndValue = 0.6;
    private maxLife = 0.8;
    private canvasWidth = 1200;
    private pixelParticleEndValue = (this.canvasWidth / 2) * this.relativeParticleEndValue;

    constructor(tiles: Tile[]) {
        this.tiles = tiles;
    }

    public createFrostBlast(position: Vector, inverse: boolean) {

        let closestX = 0;
        let deltaX = 0;
        let maxLifetime = this.maxLife;

        let relativePos: Vector;
        if (inverse) {
            closestX = this.collisionDetection.getClosestX(new Rectangle(position.x - this.pixelParticleEndValue, position.y, this.pixelParticleEndValue, 40), this.tiles, inverse)
            relativePos = this.renderHelper.getRelativeValue(position.x + 5, position.y + 27);
            deltaX = position.x - closestX;

            if (deltaX < this.pixelParticleEndValue) {
                maxLifetime = deltaX / this.pixelParticleEndValue + 0.07;
            }
        } else {
            closestX = this.collisionDetection.getClosestX(new Rectangle(position.x, position.y, this.pixelParticleEndValue, 40), this.tiles, inverse)
            relativePos = this.renderHelper.getRelativeValue(position.x + 40, position.y + 27);
            deltaX = closestX - position.x;

            if (deltaX < this.pixelParticleEndValue) {
                maxLifetime = deltaX / this.pixelParticleEndValue - 0.07;
            }
        }

        maxLifetime = maxLifetime > this.maxLife ? this.maxLife : maxLifetime;

        for (let i = 0; i < 30; i++) {

            let lifeTime = Math.random() * maxLifetime;
            let startPositions: number[] = [];
            let endPositions: number[] = [];
            startPositions.push((relativePos.x));
            startPositions.push((relativePos.y) + (Math.random() * 0.01));
            startPositions.push(0);

            if (inverse) {
                endPositions.push(-this.relativeParticleEndValue + (Math.random() * 0.1));
            } else {
                endPositions.push(this.relativeParticleEndValue - (Math.random() * 0.1));
            }



            endPositions.push(0 - ((Math.random() * 2 - 1) * 0.04));
            endPositions.push(0);


            this.particles.push(new Particle(startPositions, endPositions, lifeTime));
        }
    }

}