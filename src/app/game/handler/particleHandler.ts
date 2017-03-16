import { Particle } from '../particle/particle'
import { Vector, Tile, Rectangle, DebugElement, SpellType } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { ParticleRenderCall } from '../render/particleRenderCall';
import { CollisionDetection } from '../collision/collisionDetection';
import { DebuggHandler } from './debugHandler';
import { EnemyHandler } from './enemyHandler';

export class ParticleHandler {

    public frostParticles: Particle[] = [];
    public fireParticles: Particle[] = [];
    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();
    private tiles: Tile[];
    private enemyHandler: EnemyHandler;
    private relativeParticleEndValue = 0.6;
    private maxLife = 0.8;
    private canvasWidth = 1200;
    private pixelParticleEndValue = (this.canvasWidth / 2) * this.relativeParticleEndValue;

    private latestRenderCalls: ParticleRenderCall[] = [];

    constructor(tiles: Tile[], enemyHandler: EnemyHandler) {
        this.tiles = tiles;
        this.enemyHandler = enemyHandler;
    }

    public createFrostBlast(position: Vector, inverse: boolean) {
        let particles = this.createParticles(position, inverse);

        this.frostParticles.push(...particles);
    }

    public createFireBlast(position: Vector, inverse: boolean) {
        let particles = this.createParticles(position, inverse);

        this.fireParticles.push(...particles);
    }

    private createParticles(position: Vector, inverse: boolean) {
        let particles: Particle[] = [];
        let relativePos: Vector;
        let maxLifetime = this.calculateMaximumLifetime(position, inverse);

        if (inverse) {
            relativePos = this.renderHelper.getRelativeValue(position.x + 5, position.y + 27);
        } else {
            relativePos = this.renderHelper.getRelativeValue(position.x + 40, position.y + 27);
        }

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

            particles.push(new Particle(startPositions, endPositions, lifeTime));
        }

        return particles;
    }

    private calculateMaximumLifetime(position: Vector, inverse: boolean) {
        let closestX = 0;
        let deltaX = 0;
        let maxLifetime = this.maxLife;

        if (inverse) {
            closestX = this.collisionDetection.getClosestX(new Rectangle(position.x - this.pixelParticleEndValue, position.y, this.pixelParticleEndValue, 40), this.tiles, inverse)
            deltaX = position.x - closestX;
            if (deltaX < this.pixelParticleEndValue) {
                maxLifetime = deltaX / this.pixelParticleEndValue + 0.07;
            }
        } else {
            closestX = this.collisionDetection.getClosestX(new Rectangle(position.x, position.y, this.pixelParticleEndValue, 40), this.tiles, inverse)
            deltaX = closestX - position.x;
            if (deltaX < this.pixelParticleEndValue) {
                maxLifetime = deltaX / this.pixelParticleEndValue - 0.07;
            }
        }

        return maxLifetime = maxLifetime > this.maxLife ? this.maxLife : maxLifetime;
    }

    update(delta: number) {
        this.latestRenderCalls = [];
        
        this.latestRenderCalls.push(this.updateParticles(delta, this.frostParticles, [0.6, 1, 1, 1], SpellType.frostBlast));
        this.latestRenderCalls.push(this.updateParticles(delta, this.fireParticles, [0, 1, 1, 1], SpellType.fireBlast));
    }

    private updateParticles(delta: number, particles: Particle[], color: number[], type: SpellType) {
        let renderCall = new ParticleRenderCall();
        let deadParticles: Particle[] = [];

        renderCall.type = type;
        renderCall.length = particles.length;
        renderCall.color = color;
        
        for (let particle of particles) {

            particle.elapsedMs += delta;
            particle.relativeTime = particle.elapsedMs / 1000;

            let area = this.getParticleCollArea(particle);

            for (let enemy of this.enemyHandler.enemies) {
                if (!particle.dead && this.collisionDetection.aabbCheck(area, enemy.getCollisionArea())) {
                    particle.lifetime = particle.relativeTime + 0.05;
                    particle.dead = true;
                    enemy.freeze();
                }
            }

            if (particle.relativeTime >= particle.lifetime) {
                deadParticles.push(particle);
            }
            
            renderCall.lifetimes.push(particle.lifetime);
            renderCall.relativeTime.push(particle.relativeTime);
            renderCall.startPositions.push.apply(renderCall.startPositions, particle.startPos);
            renderCall.endPositions.push.apply(renderCall.endPositions, particle.endPos);
        }

        for (let particle of deadParticles) {
            let index = particles.indexOf(particle);
            if (index != -1) {
                particles.splice(index, 1);
            }
        }

        return renderCall;
    }

    public getParticleRenderCalls() {
        return this.latestRenderCalls;
    }

    private getParticleCollArea(particle: Particle) {
        let x = (particle.startPos[0] + (particle.relativeTime * particle.endPos[0]) + 1) * (1200 / 2);
        let y = 800 - (particle.startPos[1] + (particle.relativeTime * particle.endPos[1]) + 1) * (800 / 2);

        return new Rectangle(x, y, 1, 1);
    }

}