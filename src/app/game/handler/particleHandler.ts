import { Particle } from '../particle/particle'
import { Vector, Tile, Rectangle, DebugElement, SpellType, TextureType } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { RenderCall } from '../render/renderCall';
import { SimpleParticleRenderCall } from '../render/simpleParticleRenderCall';
import { ParticleRenderCall } from '../render/particleRenderCall';
import { CollisionDetection } from '../collision/collisionDetection';
import { DebuggHandler } from './debugHandler';
import { EnemyHandler } from './enemyHandler';
import { Gravity } from '../forces/gravity';

export class ParticleHandler {

    public frostParticles: Particle[] = [];

    public fireParticles: Particle[] = [];
    public fireEffectParticles: Particle[] = [];

    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();
    private tiles: Tile[];
    private enemyHandler: EnemyHandler;
    private gravity: Gravity = new Gravity(0.0001);

    private flameParticleSettings: number[] = [
        2, 5,
        600, 800,
        0.3, 0.4,
        -0.05, -0.03,
        0.1
    ];

    private flameEffectSettings: number[] = [
        1, 3,
        100, 400,
        0.3, 0.4,
        -0.2, 0.05,
        0.0
    ];

    private latestRenderCalls: ParticleRenderCall[] = [];

    constructor(tiles: Tile[], enemyHandler: EnemyHandler) {
        this.tiles = tiles;
        this.enemyHandler = enemyHandler;
    }

    public createFrostBlast(position: Vector, inverse: boolean) {
        let particles = this.createParticles(position, inverse, this.flameParticleSettings, 10);

        this.frostParticles.push(...particles);
    }

    public createFireBlast(position: Vector, inverse: boolean) {
        let particles = this.createParticles(position, inverse, this.flameParticleSettings, 10);
        let effectParticles = this.createParticles(position, inverse, this.flameEffectSettings, 5);

        this.fireParticles.push(...particles);
        this.fireEffectParticles.push(...effectParticles);
    }

    public update(delta: number) {

        let effectParticleCollections: Particle[][] = [];
        effectParticleCollections.push(this.fireEffectParticles);

        let particleCollections: Particle[][] = [];
        particleCollections.push(this.fireParticles);

        this.updateEffectParticles(effectParticleCollections, delta);

        this.updateParticles(particleCollections, delta);
    }

    public createRenderCall(renderCall: SimpleParticleRenderCall, camera: Vector) {

        var temp: number[] = [];

        let totalParticles = this.fireParticles.concat(this.fireEffectParticles);

        for (let particle of totalParticles) {
            renderCall.vertecies.push(...[particle.area.x - camera.x, particle.area.y - camera.y]);
            renderCall.pointSize.push(particle.area.width);
            renderCall.color = [1, 0.5, 0.2, 0.8];
            renderCall.itemCount = totalParticles.length;
        }

        return renderCall;
    }

    private updateEffectParticles(effectParticleCollections: Particle[][], delta: number) {
        for (let particleCollection of effectParticleCollections) {
            let removeCollection: Particle[] = [];

            for (let particle of particleCollection) {
                this.updateParticle(particle, delta);
                let collisionSize = particle.area.width / 2;
                let collisionRectangle = new Rectangle(particle.area.x, particle.area.y, collisionSize, collisionSize);

                if (particle.lifeTime <= 0 || particle.area.width < 0 || particle.dead) {
                    removeCollection.push(particle);
                }

                this.removeParticles(removeCollection, particleCollection);
            }
        }
    }

    private updateParticles(particleCollections: Particle[][], delta: number) {
        for (let particleCollection of particleCollections) {
            let removeCollection: Particle[] = [];

            for (let particle of particleCollection) {
                this.updateParticle(particle, delta);
                let collisionSize = particle.area.width / 2;
                let collisionRectangle = new Rectangle(particle.area.x, particle.area.y, collisionSize, collisionSize);

                if (!particle.dead) {
                    for (let enemy of this.enemyHandler.enemies) {
                        if (this.collisionDetection.aabbCheck(collisionRectangle, enemy.getCollisionArea())) {
                            enemy.takeDamage(0.15, SpellType.fireBlast);
                            particle.dead = true;
                            particle.lifeTime = particle.lifeTime > 10 ? 10 : particle.lifeTime;
                        }
                    }
                }

                if (particle.lifeTime <= 0 || particle.area.width < 0) {
                    removeCollection.push(particle);
                }

                this.removeParticles(removeCollection, particleCollection);
            }
        }
    }

    private removeParticles(removeCollection: Particle[], particleCollection: Particle[]) {
        for (let particle of removeCollection) {
            let index = particleCollection.indexOf(particle);

            if (index != -1) {
                particleCollection.splice(index, 1);
            }
        }
    }

    private updateParticle(particle: Particle, delta: number) {
        this.gravity.apply(particle.velocity, delta);
        particle.area.x += particle.velocity.x * delta;
        particle.area.y += particle.velocity.y * delta;
        particle.lifeTime -= delta;
        particle.area.width += particle.growth;
        particle.area.height += particle.growth;
    }

    private createParticles(position: Vector, inverse: boolean, settings: number[], particleNumber: number) {

        let newParticles: Particle[] = []

        for (let i = 0; i < particleNumber; i++) {

            let particleSize = this.rand(settings[0], settings[1]);


            let velocity: Vector;
            let area: Rectangle;
            let deltaX: number;

            if (inverse) {
                velocity = new Vector(-this.rand(settings[4], settings[5]), this.rand(settings[6], settings[7]));
                area = new Rectangle(position.x + 15, position.y + 25, particleSize, particleSize);
                deltaX = this.collisionDetection.getClosestX(new Rectangle(area.x - settings[3], area.y - 8, settings[3], 1), this.tiles, inverse) - area.x;
            } else {
                velocity = new Vector(this.rand(settings[4], settings[5]), this.rand(settings[6], settings[7]));
                area = new Rectangle(position.x + 25, position.y + 25, particleSize, particleSize);
                deltaX = this.collisionDetection.getClosestX(new Rectangle(area.x, area.y - 8, settings[3], 1), this.tiles, inverse) - area.x;
            }

            let lifeTime: number;
            let collTime = Math.abs((deltaX / velocity.x));
            if (collTime < settings[3]) {
                if (collTime < settings[2]) {
                    lifeTime = this.rand(collTime, collTime + 10);
                } else {
                    lifeTime = this.rand(settings[2], collTime + 10);
                }
            } else {
                lifeTime = this.rand(settings[2], settings[3]);
            }

            let growth = settings[8];
            let particle = new Particle(area, lifeTime, velocity, growth);

            newParticles.push(particle);
        }

        return newParticles;
    }

    private rand(min: number, max: number) {
        return min + (Math.random() * (max - min))
    }

}