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

    public necroEffectParticles: Particle[] = [];

    public shieldEffectParticles: Particle[] = [];
    public tiles: Tile[];

    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();
    private gravity: Gravity = new Gravity(0.0001);
    private noGravity: Gravity = new Gravity(0);

    private fireColor = [1, 0.5, 0.2, 0.8];
    private frostColor = [0.4, 0.9, 0.9, 0.9];
    private frostEffectColor = [0.7, 0.9, 0.9, 0.9];
    private shieldColor = [0.5, 0.4, 0.7, 0.7];
    private necroColor = [0, 0.5, 0, 0.8];

    private flameParticleSettings: number[] = [
        2, 5,
        500, 700,
        0.4, 0.5,
        -0.05, -0.03,
        0.1
    ];

    private largeFlameParticleSettings: number[] = [
        4, 6,
        500, 700,
        0.4, 0.5,
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

    private channelMagicEffectSettings: number[] = [
        8, 4,
        500, 500,
        -10, 10,
        0.1, 0.1,
        -0.2,
        0, Math.PI * 2
    ];

    private fireExplosionSettings: number[] = [
        4, 8,
        500, 500,
        -20, 20,
        0.05, 0.2,
        -0.2,
        0, Math.PI * 2,
    ];

    private magicEffectSettings: number[] = [
        1, 3,
        300, 300,
        -0.01, 0.01,
        -0.2, 0,
        0.1
    ];

    private frostParticleSettings: number[] = [
        3, 5,
        600, 800,
        0.4, 0.5,
        -0.02, 0.02,
        0.2
    ]

    private largefrostParticleSettings: number[] = [
        5, 7,
        600, 800,
        0.5, 0.6,
        -0.02, 0.02,
        0.2
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

    private shieldEffectSettings: number[] = [
        2, 4,
        200, 200,
        10, 10,
        0.1, 0.1,
        0.2,
        0, Math.PI * 2
    ];

    private invertedShieldEffectSettings: number[] = [
        2, 4,
        100, 100,
        10, 10,
        0.1, 0.1,
        0.2,
        -Math.PI * 0.52, -Math.PI * 1.30
    ];

    private shieldExplosionEffectSettings: number[] = [
        4, 8,
        1000, 1500,
        -20, 20,
        -0.2, 0.2,
        -0.1,
        -Math.PI * 0.52, Math.PI * 0.30
    ];

    private invertedShieldExplosionEffectSettings: number[] = [
        4, 8,
        1000, 1500,
        -20, 20,
        -0.2, 0.2,
        -0.1,
        -Math.PI * 0.52, -Math.PI * 1.30
    ];

    constructor() {
    }

     public createShieldExplosionEffect(position: Vector, inverse: boolean) {
        position.y = position.y - 5;

        let settings: number[] = [];
        if (inverse) {
            settings = this.invertedShieldExplosionEffectSettings;
        } else {
            settings = this.shieldExplosionEffectSettings;
        }

        let effectParticles = this.createCircleParticles(position, 40, 40, false, settings, 100);

        this.shieldEffectParticles.push(...effectParticles);
    }

    public createShieldEffect(position: Vector, inverse: boolean, shieldLevel: number) {
        position.y = position.y + 5;

        let effectParticles = this.createCenterCircleParticles(position, 10, 20, this.shieldEffectSettings, false, 0, 0, 100, 0, 1 + shieldLevel);

        this.shieldEffectParticles.push(...effectParticles);
    }

    public createFireBall(position: Vector, size: number, inverse: boolean, offsetX: number) {

        let effectParticles = this.fireBall(position, size, inverse, offsetX);

        this.fireEffectParticles.push(...effectParticles);
    }

    public createNecroFireBall(position: Vector, size: number, inverse: boolean, offsetX: number) {

        let effectParticles = this.fireBall(position, size, inverse, offsetX);

        this.necroEffectParticles.push(...effectParticles);
    }

    public createNecroballExplosion(position: Vector, size: number) {
        let effectParticles = this.fireballExplosion(position, size);

        this.necroEffectParticles.push(...effectParticles);
    }

    public createFireballExplosion(position: Vector, size: number) {

        let effectParticles = this.fireballExplosion(position, size);

        this.fireEffectParticles.push(...effectParticles);
    }

    private fireballExplosion(position: Vector, size: number) {
        let radius = size / 2;
        let particleSize = 2 + (size/20);

        position.x = position.x + radius;
        position.y = position.y + radius;

        let settings: number[] = [
            particleSize, particleSize * 2,
            500, 500,
            -20, 20,
            0.05, 0.2,
            -0.2,
            0, Math.PI * 2,
        ];

        let effectParticles = this.createCircleParticles(position, 0, 0, false, settings, 50);

        return effectParticles;
    }

    public createChannelMagic(position: Vector, inverse: boolean) {

        let positionOffset = new Vector(position.x + 25, position.y + 45);

        let effectParticles = this.createCenterCircleParticles(positionOffset, 30, 40, this.channelMagicEffectSettings, true, 3, 10, 100, 0, 2);

        this.fireEffectParticles.push(...effectParticles);
    }

    public createMagicEffect(position: Vector, inverse: boolean) {

        let offSetX = this.rand(-10, 10) + 22;
        let offSetY = this.rand(-5, 10) + 45;
        let positionOffset = new Vector(position.x + offSetX, position.y + offSetY);

        let effectParticles = this.createParticles(positionOffset, inverse, this.magicEffectSettings, 1);

        this.fireEffectParticles.push(...effectParticles);
    }

    public createFrostBlast(position: Vector, inverse: boolean, frostLevel: number) {

        let positionOffset = new Vector(position.x, position.y);
        positionOffset.y += 45;

        if (inverse) {
            positionOffset.x += 10;
        } else {
            positionOffset.x += 40;
        }

        let settings: number[];

        if(frostLevel == 3) {
            settings = this.largefrostParticleSettings;
        } else {
            settings = this.frostParticleSettings;
        }

        let particles = this.createParticles(positionOffset, inverse, settings, 3 + (frostLevel * 3));
        let effectParticles = this.createParticles(positionOffset, inverse, this.frostEffectParticleSettings, 2 + (frostLevel * 1));

        this.frostEffectParticles.push(...effectParticles);
        this.frostParticles.push(...particles);
    }

    public createFireBlast(position: Vector, inverse: boolean, fireLevel: number) {

        let positionOffset = new Vector(position.x, position.y);
        positionOffset.y += 45;

        if (inverse) {
            positionOffset.x += 10;
        } else {
            positionOffset.x += 40;
        }

        let settings: number[];

        if(fireLevel == 3) {
            settings = this.largeFlameParticleSettings;
        } else {
            settings = this.flameParticleSettings;
        }

        let particles = this.createParticles(positionOffset, inverse, settings, 3 + (fireLevel * 3));
        let effectParticles = this.createParticles(positionOffset, inverse, this.flameEffectSettings, 2 + (fireLevel * 1));

        this.fireParticles.push(...particles);
        this.fireEffectParticles.push(...effectParticles);
    }

    public createBurn(position: Vector) {
        let positionCopy = new Vector(position.x, position.y);
        positionCopy.x += this.rand(-10, 15) + 25;
        positionCopy.y += this.rand(-10, 10) + 25;

        let effectParticles = this.createParticles(positionCopy, false, this.burnEffectSettings, 1);
        this.fireEffectParticles.push(...effectParticles);
    }

    public createFireDeath(position: Vector) {
        position.x += this.rand(-15, 15);

        position.x += 25;
        position.y += 25;

        let effectParticles = this.createParticles(position, false, this.burnEffectSettings, 5);
        this.fireEffectParticles.push(...effectParticles);
    }

    public update(delta: number, enemies: Enemy[]) {

        this.updateEffectParticles(this.necroEffectParticles, delta);
        this.updateEffectParticles(this.fireEffectParticles, delta);
        this.updateEffectParticles(this.frostEffectParticles, delta);
        this.updateEffectParticles(this.shieldEffectParticles, delta);

        this.updateParticles(this.frostParticles, this.noGravity, delta, enemies, SpellType.frostBlast);
        this.updateParticles(this.fireParticles, this.gravity, delta, enemies, SpellType.fireBlast);
    }

    public createRenderCalls(renderCalls: SimpleParticleRenderCall[]) {
        let fireRenderCall: SimpleParticleRenderCall = new SimpleParticleRenderCall();
        let allFireParticles = this.fireParticles.concat(this.fireEffectParticles)

        let frostRenderCall: SimpleParticleRenderCall = new SimpleParticleRenderCall();
        let frostEffectRenderCall: SimpleParticleRenderCall = new SimpleParticleRenderCall();
        frostEffectRenderCall.textureType = TextureType.frostTexture;

        let shieldEffectRenderCall: SimpleParticleRenderCall = new SimpleParticleRenderCall();
        shieldEffectRenderCall.textureType = TextureType.particleTexture;

        let blackFireRenderCall: SimpleParticleRenderCall = new SimpleParticleRenderCall();
        blackFireRenderCall.textureType = TextureType.particleTexture;

        renderCalls.push(this.addParticles(fireRenderCall, allFireParticles, this.fireColor));
        renderCalls.push(this.addParticles(frostEffectRenderCall, this.frostEffectParticles, this.frostEffectColor));
        renderCalls.push(this.addParticles(frostRenderCall, this.frostParticles, this.frostColor));
        renderCalls.push(this.addParticles(shieldEffectRenderCall, this.shieldEffectParticles, this.shieldColor))
        renderCalls.push(this.addParticles(blackFireRenderCall, this.necroEffectParticles, this.necroColor))

        return renderCalls;
    }

    private fireBall(position: Vector, size: number, inverse: boolean, offsetX: number) {

        let positionOffset = new Vector(position.x, position.y);
        let strength = size / 2;
        let radius = strength / 2;
        let offset = strength / 10;
        let settingFactor = size / 100;

        if (inverse) {
            positionOffset.x += (strength - offsetX);
        } else {
            positionOffset.x += (strength + offsetX);
        }

        positionOffset.y += strength;

        let channelMagicEffectSettings: number[] = [
            4 + (4 * settingFactor), 2 + (2 * settingFactor),
            500, 500,
            -10, 10,
            0, 0,
            -0.2
        ];

        let effectParticles = this.createCenterCircleParticles(positionOffset, radius, radius, channelMagicEffectSettings, false, offset, strength, 200, -offset, 2);

        return effectParticles;
    }

    private addParticles(renderCall: SimpleParticleRenderCall, particles: Particle[], color: number[]) {
        for (let particle of particles) {
            renderCall.vertecies.push(...[particle.area.x, particle.area.y]);
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
                        if (spelltype == SpellType.frostBlast) {
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
                area = new Rectangle(position.x, position.y, particleSize, particleSize);
                deltaX = this.collisionDetection.getClosestX(new Rectangle(area.x - settings[3], area.y - 8, settings[3], 1), this.tiles, inverse) - area.x;
            } else {
                velocity = new Vector(this.rand(settings[4], settings[5]), this.rand(settings[6], settings[7]));
                area = new Rectangle(position.x, position.y, particleSize, particleSize);
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

    private createCenterCircleParticles(position: Vector, radiusX: number, radiusY: number, settings: number[], inward: boolean, centerOffsetValue: number, centerSize: number, centerLifeTime: number, centerGrowth: number, particleNumber: number) {

        let newParticles: Particle[] = [];

        let centerOffSetX = this.rand(-centerOffsetValue, centerOffsetValue);
        let centerOffSetY = this.rand(-centerOffsetValue, centerOffsetValue);
        let centerParticle = new Particle(new Rectangle(position.x + centerOffSetX, position.y + centerOffSetY, centerSize, centerSize), centerLifeTime, new Vector(0, 0), centerGrowth);

        newParticles.push(centerParticle);
        newParticles.push(...this.createCircleParticles(position, radiusX, radiusY, inward, settings, particleNumber));

        return newParticles;
    }

    private createCircleParticles(position: Vector, radiusX: number, radiusY: number, inward: boolean, settings: number[], particleNumber: number) {

        let particles: Particle[] = [];

        for (let i = 0; i < particleNumber; i++) {

            let particleSize = this.rand(settings[0], settings[1]);
            let lifeTime = this.rand(settings[2], settings[3]);
            let offSet = this.rand(settings[4], settings[5]);

            let x: number;
            let y: number;
            let velocity: Vector;
            let angle = this.rand(settings[9], settings[10]);
            x = position.x + ((radiusX + offSet) * Math.cos(angle));
            y = position.y + ((radiusY + offSet) * Math.sin(angle));

            if (inward) {
                velocity = new Vector(-(x - position.x), -(y - position.y));
            } else {
                velocity = new Vector(x - position.x, y - position.y);
            }

            velocity.normalize();
            velocity.multiply(this.rand(settings[6], settings[7]));

            let particle = new Particle(new Rectangle(x, y, particleSize, particleSize), lifeTime, velocity, settings[8]);

            particles.push(particle);
        };

        return particles;
    }

    private rand(min: number, max: number) {
        return min + (Math.random() * (max - min))
    }

}