import { Particle } from '../particle/particle'
import { Vector, Tile, Rectangle, DebugElement, SpellType, TextureType } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { RenderCall } from '../render/renderCall';
import { SimpleParticleRenderCall } from '../render/simpleParticleRenderCall';
import { ParticleRenderCall } from '../render/particleRenderCall';
import { CollisionDetection } from '../collision/collisionDetection';
import { DebuggHandler } from './debugHandler';
import { EnemyHandler } from './enemyHandler';

export class ParticleHandler {

    public frostParticles: Particle[] = [];

    public fireParticles: Particle[] = [];
    public fireEffectParticles: Particle[] = [];

    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();
    private tiles: Tile[];
    private enemyHandler: EnemyHandler;

    private flameParticleSettings: number[] = [
        2, 5,
        800, 1000,
        0.3, 0.4,
        -0.01, 0.01,
        0.1
    ];

    private flameEffectSettings: number[] = [
        1, 3,
        100, 600,
        0.3, 0.4,
        -0.2, 0.2,
        0.0
    ];

    private latestRenderCalls: ParticleRenderCall[] = [];

    constructor(tiles: Tile[], enemyHandler: EnemyHandler) {
        this.tiles = tiles;
        this.enemyHandler = enemyHandler;
    }

    public createFrostBlast(position: Vector, inverse: boolean) {
        let particles = this.createParticles(position, inverse, this.flameParticleSettings);

        this.frostParticles.push(...particles);
    }

    public createFireBlast(position: Vector, inverse: boolean) {
        let particles = this.createParticles(position, inverse, this.flameParticleSettings);
        let effectParticles = this.createParticles(position, inverse, this.flameEffectSettings);

        this.fireParticles.push(...particles);
        this.fireEffectParticles.push(...effectParticles);
    }

    public update(delta: number) {

        let particleCollections: Particle[][] = [];
        particleCollections.push(this.fireParticles);
        particleCollections.push(this.fireEffectParticles);

        for (let particleCollection of particleCollections) {
            let removeCollection: Particle[] = [];

            for (let fireParticle of particleCollection) {
                fireParticle.position.x += fireParticle.velocity.x * delta;
                fireParticle.position.y += fireParticle.velocity.y * delta;
                fireParticle.lifeTime -= delta;
                fireParticle.size += fireParticle.growth;
                fireParticle.size += fireParticle.growth;

                if (fireParticle.lifeTime <= 0 || fireParticle.size < 0) {
                    removeCollection.push(fireParticle);
                }
            }

            for (let particle of removeCollection) {
                let index = particleCollection.indexOf(particle);

                if (index != -1) {
                    particleCollection.splice(index, 1);
                }
            }
        }
    }

    public createRenderCall(renderCall: SimpleParticleRenderCall, camera: Vector) {

        var temp: number[] = [];

        let totalParticles = this.fireParticles.concat(this.fireEffectParticles);

        for (let particle of totalParticles) {
            renderCall.vertecies.push(...[particle.position.x - camera.x, particle.position.y - camera.y]);
            renderCall.pointSize.push(particle.size);
            renderCall.color = [0.9, 0.4, 0.1, 0.9];
            renderCall.itemCount = totalParticles.length;
        }

        return renderCall;
    }

    private createParticles(position: Vector, inverse: boolean, settings: number[]) {

        let newParticles: Particle[] = []

        for (let i = 0; i < 10; i++) {

            let particleSize = this.rand(settings[0], settings[1]);
            let lifeTime = this.rand(settings[2], settings[3]);
            let velocity = new Vector(this.rand(settings[4], settings[5]), this.rand(settings[6], settings[7]));
            let growth = settings[8];

            let pPosition = new Vector(position.x + 25, position.y + 25);
            let particle = new Particle(pPosition, particleSize, lifeTime, velocity, growth);

            newParticles.push(particle);
        }

        return newParticles;
    }

    private rand(min: number, max: number) {
        return min + (Math.random() * (max - min))
    }

}