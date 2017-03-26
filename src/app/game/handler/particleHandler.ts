import { Particle } from '../particle/particle'
import { Vector, Tile, Rectangle, DebugElement, SpellType, TextureType } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { RenderCall } from '../render/renderCall';
import { SimpleParticleRenderCall } from '../render/simpleParticleRenderCall';
import { ParticleRenderCall } from '../render/particleRenderCall';
import { CollisionDetection } from '../collision/collisionDetection';
import { DebugHandler } from './debugHandler';
import { EnemyHandler } from './enemyHandler';
import { Enemy } from '../character/enemy';
import { Gravity } from '../forces/gravity';

export class ParticleHandler {

    public frostParticles: Particle[] = [];
    public frostEffectParticles: Particle[] = [];

    public fireParticles: Particle[] = [];
    public fireEffectParticles: Particle[] = [];

    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();
    private tiles: Tile[];
    private gravity: Gravity = new Gravity(0.0001);
    private noGravity: Gravity = new Gravity(0);

    private fireColor = [1, 0.5, 0.2, 0.8];
    private frostColor = [0.4, 0.9, 0.9, 0.9];
    private frostEffectColor = [0.7, 0.9, 0.9, 0.9];

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

    private frostParticleSettings: number[] = [
        3, 5,
        600, 800,
        0.4, 0.5,
        -0.02, 0.02,
        0.2,
    ]

    private frostEffectParticleSettings: number[] = [
        2, 4,
        200, 800,
        0.4, 0.5,
        -0.08, 0.05,
        0.0,
    ]

    private burnEffectSettings: number[] = [
        10, 15,
        100, 400,
        0.05, -0.05,
        -0.1, -0.1,
        0.0
    ];

    constructor(tiles: Tile[]) {
        this.tiles = tiles;
    }

    public createFrostBlast(position: Vector, inverse: boolean) {
        let particles = this.createParticles(position, inverse, this.frostParticleSettings, 10);
        let effectParticles = this.createParticles(position, inverse, this.frostEffectParticleSettings, 2);

        this.frostEffectParticles.push(...effectParticles);
        this.frostParticles.push(...particles);
    }

    public createFireBlast(position: Vector, inverse: boolean) {
        let particles = this.createParticles(position, inverse, this.flameParticleSettings, 10);
        let effectParticles = this.createParticles(position, inverse, this.flameEffectSettings, 5);

        this.fireParticles.push(...particles);
        this.fireEffectParticles.push(...effectParticles);
    }

    public createBurn(position: Vector) {
        let positionCopy = new Vector(position.x, position.y);
        positionCopy.x += this.rand(-10, 15);
        positionCopy.y += this.rand(-10, 10);
        let effectParticles = this.createParticles(positionCopy, false, this.burnEffectSettings, 1);
        this.fireEffectParticles.push(...effectParticles);
    }

    public createFireDeath(position: Vector) {
        position.x += this.rand(-15, 15);
        let effectParticles = this.createParticles(position, false, this.burnEffectSettings, 5);
        this.fireEffectParticles.push(...effectParticles);
    }

    public update(delta: number, enemies: Enemy[]) {

        this.updateEffectParticles(this.fireEffectParticles, delta);
        this.updateEffectParticles(this.frostEffectParticles, delta);

        this.updateParticles(this.frostParticles, this.noGravity, delta, enemies, SpellType.frostBlast);
        this.updateParticles(this.fireParticles, this.gravity, delta, enemies, SpellType.fireBlast);
    }

    public createRenderCalls(renderCalls: SimpleParticleRenderCall[], camera: Vector) {
        let fireRenderCall: SimpleParticleRenderCall = new SimpleParticleRenderCall();
        let allFireParticles = this.fireParticles.concat(this.fireEffectParticles)

        renderCalls.push(this.addParticles(fireRenderCall, allFireParticles, camera, this.fireColor));

        let frostRenderCall: SimpleParticleRenderCall = new SimpleParticleRenderCall();
        let frostEffectRenderCall: SimpleParticleRenderCall = new SimpleParticleRenderCall();
        frostEffectRenderCall.textureType = TextureType.frostTexture;

        renderCalls.push(this.addParticles(frostEffectRenderCall, this.frostEffectParticles, camera, this.frostEffectColor));
        renderCalls.push(this.addParticles(frostRenderCall, this.frostParticles, camera, this.frostColor));

        return renderCalls;
    }

    private addParticles(renderCall: SimpleParticleRenderCall, particles: Particle[], camera: Vector, color: number[]) {
        for (let particle of particles) {
            renderCall.vertecies.push(...[particle.area.x - camera.x, particle.area.y - camera.y]);
            renderCall.pointSize.push(particle.area.width);
            renderCall.color = color;
            renderCall.itemCount = particles.length;
        }

        return renderCall;
    }

    private updateEffectParticles(particleCollection: Particle[], delta: number) {
        let removeCollection: Particle[] = [];

        for (let particle of particleCollection) {
            this.updateParticle(particle, delta);
            let collisionSize = particle.area.width / 2;
            let collisionRectangle = new Rectangle(particle.area.x, particle.area.y, collisionSize, collisionSize);

            if (particle.lifeTime <= 0 || particle.area.width < 0 || particle.dead) {
                removeCollection.push(particle);
            }
        }

        this.removeParticles(removeCollection, particleCollection);
    }

    private updateParticles(particleCollection: Particle[], gravity: Gravity, delta: number, enemies: Enemy[], spelltype: SpellType) {

        let removeCollection: Particle[] = [];

        for (let particle of particleCollection) {
            gravity.apply(particle.velocity, delta);
            this.updateParticle(particle, delta);
            let collisionSize = particle.area.width / 2;
            let collisionRectangle = new Rectangle(particle.area.x, particle.area.y, collisionSize, collisionSize);

            if (!particle.dead) {
                for (let enemy of enemies) {
                    if (this.collisionDetection.aabbCheck(collisionRectangle, enemy.getCollisionArea())) {
                        if(spelltype == SpellType.frostBlast) {
                            enemy.freeze();
                        } else {
                            enemy.burn();
                        }
                        
                        particle.dead = true;
                        particle.lifeTime = particle.lifeTime > 10 ? this.rand(10, 20) : particle.lifeTime;
                    }
                }
            }

            if (particle.lifeTime <= 0 || particle.area.width < 0) {
                removeCollection.push(particle);
            }
        }

        this.removeParticles(removeCollection, particleCollection);
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