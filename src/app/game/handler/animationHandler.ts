import { Vector, Sprite, Rectangle, Animation, SpellType, FrameAnimation, RotationAnimation, StaticRotationAnimation, Projectile } from '../model'
import { RenderCall, DynamicRenderCall, RenderHelper, Matrix3, TextureMapper, ColorRenderCall } from '../render';
import { Context } from '../context';
import { CollisionData } from '../collision/collisionData';
import { Player } from '../character/player';
import { ParticleHandler } from '../handler/particleHandler';
import { AudioHandler } from "./audioHandler";

export class AnimationHandler {

    public animations: Animation[] = [];
    public dynamicAnimations: Animation[] = [];
    private staticAnimations: Animation[] = [];
    private particleHandler: ParticleHandler;
    private textureMapper = TextureMapper.getInstance();
    private renderHelper = RenderHelper.getInstance();

    constructor(particleHandler: ParticleHandler, public audioHandler: AudioHandler) {
        this.particleHandler = particleHandler;
    }

    public bloodAnimation_A(position: Vector, size: number) {
        let animation = new Animation([100, 101, 102, 103, 104, 105]);

        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public bloodAnimation_B_Right(position: Vector, size: number) {
        let animation = new Animation([106, 107, 108, 109, 110, 111]);
        animation.areaToRender = new Rectangle(position.x - 75, position.y, size, size);

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public bloodAnimation_B_Left(position: Vector, size: number) {
        let animation = new Animation([106, 107, 108, 109, 110, 111]);
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.inverse = true;

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public voidAnimation() {
        let animation = new Animation([]);

        animation.areaToRender = new Rectangle(0, 0, 0, 0);

        return animation;
    }

    public bloodAnimation_C(position: Vector, size: number) {
        let animation = new Animation([147, 148, 149, 150, 151, 152]);

        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public swordman_death(position: Vector, inverse: boolean) {
        let animation = new Animation([
            214, 216, 217, 218
        ]);

        animation.timeToChange = 120;

        animation.repetitions = 4;

        animation.areaToRender = new Rectangle(position.x, position.y, 56, 59);

        animation.inverse = inverse;

        animation.onCompletion = () => {
            this.swordman_corpse(position, inverse);
        }

        this.animations.push(animation);

        return animation;
    }

    public createArcherDeath(area: Rectangle, inverse: boolean) {
        this.bloodAnimation_C(new Vector(area.x - 10, area.y - 20), 75);
        this.bloodAnimation_B_Left(new Vector(area.x - 10, area.y - 20), 75);
        this.bloodAnimation_B_Right(new Vector(area.x + 65, area.y - 20), 75);
        this.archer_death(area, inverse);
        
    }

    public archer_death(area: Rectangle, inverse: boolean) {
        let animation = new Animation([290, 291, 292, 293]);

        animation.timeToChange = 120;

        animation.repetitions = 4;

        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.inverse = inverse;

        animation.onCompletion = () => {
            this.archer_corpse(area, inverse);
        }

        this.animations.push(animation);

        return animation;
    }

    public archer_corpse(area: Rectangle, inverse: boolean) {
        let animation = new Animation([293]);
        animation.timeToChange = 120;

        animation.delay = 4;

        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.inverse = inverse;

        this.staticAnimations.push(animation);

        return animation;
    }

    public player_sword_death_corpse(position: Vector, inverse: boolean) {
        let animation = new Animation([306]);
        animation.timeToChange = 150;
        animation.delay = 6;

        animation.areaToRender = new Rectangle(position.x, position.y, 90, 90);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }

    public player_sword_death_animation(position: Vector, inverse: boolean) {
        let animation = new Animation([301, 302, 303, 304, 305, 306]);

        animation.inverse = inverse;
        animation.timeToChange = 150;
        animation.repetitions = 6;
        animation.areaToRender = new Rectangle(position.x, position.y, 90, 90);

        this.animations.push(animation);

        return animation;
    }

    public apprentice_Death(area: Rectangle, inverse: boolean) {
        let animation = new Animation([144, 145, 146, 153, 154, 155]);

        animation.repetitions = 5;
        animation.inverse = inverse;
        animation.timeToChange = 150;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.onCompletion = () => {
            this.apprentice_corpse(area, inverse);
        }

        this.animations.push(animation);

        return animation;
    }

    public apprentice_corpse(area: Rectangle, inverse: boolean) {
        let animation = new Animation([155]);

        animation.inverse = inverse;
        animation.timeToChange = 150;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        this.staticAnimations.push(animation);

        return animation;
    }

    public masterSorcerer_death(area: Rectangle, inverse: boolean) {
        let animation = new Animation([586, 587, 589, 590, 591, 592, 593, 594, 595, 596]);

        animation.repetitions = 9;
        animation.inverse = inverse;
        animation.timeToChange = 125;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.onCompletion = () => {
            this.masterSorcerer_corpse(area, inverse);
        }

        this.animations.push(animation);

        return animation;
    }

    public masterSorcerer_corpse(area: Rectangle, inverse: boolean) {
        let animation = new Animation([596]);

        animation.inverse = inverse;
        animation.timeToChange = 175;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        this.staticAnimations.push(animation);

        return animation;
    }    

    public screamer_Death(area: Rectangle, inverse: boolean) {
        let animation = new Animation([576, 577, 578, 579]);

        animation.repetitions = 3;
        animation.inverse = inverse;
        animation.timeToChange = 175;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.onCompletion = () => {
            this.screamer_corpse(area, inverse);
        }

        this.animations.push(animation);

        return animation;
    }

    public screamer_corpse(area: Rectangle, inverse: boolean) {
        let animation = new Animation([579]);

        animation.inverse = inverse;
        animation.timeToChange = 175;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        this.staticAnimations.push(animation);

        return animation;
    }

    public shadow_Death(area: Rectangle, inverse: boolean) {
        let animation = new Animation([132, 130, 127, 124, 119]);

        animation.repetitions = 4;
        animation.inverse = inverse;
        animation.timeToChange = 100;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.onCompletion = () => {
            this.shadow_corpse(area, inverse);
        };

        this.animations.push(animation);

        return animation;
    }

    public shadow_corpse(area: Rectangle, inverse: boolean) {
        let animation = new Animation([119]);

        animation.repetitions = 4;
        animation.inverse = inverse;
        animation.timeToChange = 100;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        this.staticAnimations.push(animation);

        return animation;
    }

    public swordman_corpse(position: Vector, inverse: boolean) {
        let animation = new Animation([219]);

        animation.timeToChange = 120;

        animation.delay = 4;

        animation.areaToRender = new Rectangle(position.x, position.y, 56, 59);

        animation.inverse = inverse;

        this.staticAnimations.push(animation);

        return animation;
    }

    public swordman_head(position: Vector, inverse: boolean) {
        let animation = new Animation([215, 220, 221, 222, 223, 224, 225, 226]);
        animation.timeToChange = 75;
        animation.areaToRender = new Rectangle(position.x, position.y, 56, 59);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }

    public fireball_destroy(position: Vector, size: number) {
        let animation = new Animation([118, 119, 120, 121, 122, 123, 124, 125, 126]);
        animation.timeToChange = 50;
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.repetitions = 9;

        this.animations.push(animation);

        return animation;
    }

    public necroball_explosion(position: Vector, size: number) {
        this.particleHandler.createNecroballExplosion(position, size);
    }

    public blue_explosion(position: Vector, size: number) {
        this.particleHandler.createBlueExplosion(position, size);
    }

    public fireball_explosion(position: Vector, size: number) {
        this.audioHandler.playSound("explosion1.wav", 2, 0, 0.05);
        this.particleHandler.createFireballExplosion(position, size);
    }

    public swordscut_a(position: Vector, size: number, inverse: boolean) {

        let animation = new Animation([55, 56, 57, 58, 59]);
        animation.inverse = inverse;
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        this.animations.push(animation);

        animation.repetitions = 5;

        return animation;
    }

    public createDebugAnimation(position: Vector, size: number, repetitions: number) {
        let animation = new Animation([5]);
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);
        animation.repetitions = repetitions;
        this.animations.push(animation);

        return animation;
    }

    public fallDeath(position: Vector) {
        this.bloodAnimation_A(new Vector(position.x, position.y + 20), 50);
        this.bloodAnimation_B_Right(new Vector(position.x + 5, position.y + 5), 100);
        this.bloodAnimation_B_Left(new Vector(position.x - 55, position.y + 5), 100);
    }

    public fireDeathSwordman(area: Rectangle, inverse: boolean) {

        let onUpdate = (position: Vector) => {
            this.particleHandler.createFireDeath(position);
        }

        let animation = new FrameAnimation(0, -4, 0, 0, onUpdate, [250, 251, 252, 253, 254, 255, 256, 257]);
        animation.inverse = inverse;
        animation.timeToChange = 100;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.repetitions = 8;

        this.animations.push(animation);

        return animation;
    }

    public fireDeathArcher(area: Rectangle, inverse: boolean) {

        let onUpdate = (position: Vector) => {
            this.particleHandler.createFireDeath(position);
        }

        let animation = new FrameAnimation(0, -4, 0, 0, onUpdate, [282, 283, 284, 285, 286, 287, 288, 289]);
        animation.inverse = inverse;
        animation.timeToChange = 100;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.repetitions = 8;

        this.animations.push(animation);

        return animation;
    }

    public createArrow(area: Rectangle, inverse: boolean, velocity: Vector) {
        let animation = new RotationAnimation(velocity, [268]);
        animation.inverse = inverse;
        animation.areaToRender = area;

        animation.timeToChange = 20000;
        animation.repetitions = 1;

        this.dynamicAnimations.push(animation);
        this.audioHandler.playSound("bow.wav", 1, 0, 0.1);

        return animation;
    }

    public createDeadArrow(area: Rectangle, inverse: boolean, velocity: Vector) {
        let collAngle = new Vector(velocity.x, velocity.y);

        let animation = new StaticRotationAnimation(collAngle, inverse, [268]);
        animation.inverse = inverse;

        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.timeToChange = 2000;
        animation.repetitions = 1;

        this.dynamicAnimations.push(animation);

        return animation;
    }

    public createArrowHit(projectile: Projectile, useCollisionArea: boolean) {

        let collAngle = new Vector(projectile.velocity.x, projectile.velocity.y);

        let animation = new RotationAnimation(collAngle, [269]);
        animation.inverse = projectile.animation.inverse;

        if (useCollisionArea) {
            animation.areaToRender = new Rectangle(projectile.collisionArea.x, projectile.collisionArea.y, projectile.area.width, projectile.area.height);
        } else {
            animation.areaToRender = new Rectangle(projectile.area.x, projectile.area.y, projectile.area.width, projectile.area.height);
        }

        animation.areaToRender.width = animation.areaToRender.width * 0.67;

        animation.timeToChange = 2000;
        animation.repetitions = 1;


        this.dynamicAnimations.push(animation);
        this.audioHandler.playSound("arrowhit.wav", 1, 0, 0.1);

        return animation;
    }

    public frozenSwordMan(area: Rectangle, inverse: boolean, color: number[], onCompletion: () => void) {
        let animation = new Animation([237, 238, 239, 240, 241, 242]);
        animation.inverse = inverse;
        animation.color = color;
        animation.timeToChange = 250;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.onCompletion = onCompletion;

        this.animations.push(animation);

        animation.repetitions = 6;

        return animation;
    }

    public frozenArcher(area: Rectangle, inverse: boolean, color: number[], onCompletion: () => void) {
        let animation = new Animation([270, 271, 272, 273, 274, 275]);
        animation.inverse = inverse;
        animation.color = color;
        animation.timeToChange = 250;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.onCompletion = onCompletion;

        this.animations.push(animation);

        animation.repetitions = 6;

        return animation;
    }

    public frozenPart(area: Rectangle, inverse: boolean, color: number[], partIndex: number, baseTextureNumber: number) {
        let animation = new Animation([baseTextureNumber + partIndex]);
        animation.inverse = inverse;
        animation.color = color;
        animation.timeToChange = 2000;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        this.animations.push(animation);

        animation.repetitions = 1;

        return animation;
    }



    public update(delta: number) {

        let completedAnimations: Animation[] = [];
        let totalAnimations = this.animations.concat(this.dynamicAnimations);

        for (let animation of totalAnimations) {
            animation.next(delta);
            if (animation.repetitions <= 0) {
                completedAnimations.push(animation);
                if (animation.onCompletion) {
                    animation.onCompletion();
                }
            }
        }

        for (let completedAnimation of completedAnimations) {
            this.remove(completedAnimation);
        }
    }

    public createDynamicRenderCall(renderCall: DynamicRenderCall, camera: [number, number]) {

        for (let animation of this.dynamicAnimations) {
            if (animation instanceof RotationAnimation || animation instanceof StaticRotationAnimation) {

                let x = animation.areaToRender.x - camera[0];
                let y = animation.areaToRender.y - camera[1];
                let width = animation.areaToRender.width;
                let height = animation.areaToRender.height;

                if (animation.inverse) {
                    renderCall.vertecies = this.renderHelper.getInverseVertecies(x, y, width, height, renderCall.vertecies);
                } else {
                    renderCall.vertecies = this.renderHelper.getVertecies(x, y, width, height, renderCall.vertecies);
                }

                renderCall.textureCoords.push.apply(renderCall.textureCoords, animation.getCurrentFrame());
                renderCall.matrices = this.renderHelper.getMatrices(x, y, width, height, animation.angle, renderCall.matrices);
                renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
            }
        }
    }

    public createRenderCall(renderCall: ColorRenderCall) {

        for (let animation of this.animations) {
            if (animation.delay <= 0) {
                let x = animation.areaToRender.x;
                let y = animation.areaToRender.y;
                let width = animation.areaToRender.width;
                let height = animation.areaToRender.height;

                if (animation.inverse) {
                    renderCall.vertecies = this.renderHelper.getInverseVertecies(x, y, width, height, renderCall.vertecies);
                } else {
                    renderCall.vertecies = this.renderHelper.getVertecies(x, y, width, height, renderCall.vertecies);
                }

                renderCall.textureCoords.push.apply(renderCall.textureCoords, animation.getCurrentFrame());

                renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
                if (animation.color) {
                    renderCall.color = this.renderHelper.getColor(renderCall.color, animation.color);
                } else {
                    renderCall.color = this.renderHelper.getColor(renderCall.color, null);
                }
            }
        }

        return renderCall;
    }

    public createStaticRenderCall(renderCall: RenderCall) {

        for (let animation of this.staticAnimations) {
            if (animation.inverse) {
                renderCall.vertecies = this.renderHelper.getInverseVertecies(animation.areaToRender.x, animation.areaToRender.y, animation.areaToRender.width, animation.areaToRender.height, renderCall.vertecies);
            } else {
                renderCall.vertecies = this.renderHelper.getVertecies(animation.areaToRender.x, animation.areaToRender.y, animation.areaToRender.width, animation.areaToRender.height, renderCall.vertecies);
            }

            renderCall.textureCoords.push.apply(renderCall.textureCoords, animation.getCurrentFrame());

            renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
        }

        return renderCall;
    }

    public remove(animation: Animation) {
        let index = this.animations.indexOf(animation);
        if (index != -1) {
            this.animations.splice(index, 1);
        } else {
            index = this.dynamicAnimations.indexOf(animation);
            if (index != -1) {
                this.dynamicAnimations.splice(index, 1);
            }
        }
    }

    public enemy(position: Vector, inverse: boolean) {
        let animation = new Animation([209, 211, 210]);
        animation.timeToChange = 120;
        animation.areaToRender = new Rectangle(position.x, position.y, 56, 58);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }


}