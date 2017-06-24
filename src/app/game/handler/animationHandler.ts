import { Vector, Sprite, Rectangle, Animation, SpellType, FrameAnimation, RotationAnimation, StaticRotationAnimation, Projectile } from '../model'
import { RenderCall, DynamicRenderCall, RenderHelper, Matrix3, TextureMapper, ColorRenderCall } from '../render';
import { Context } from '../context';
import { CollisionData } from '../collision/collisionData';
import { Player } from '../character/player';
import { ParticleHandler } from '../handler/particleHandler';

export class AnimationHandler {

    public animations: Animation[] = [];
    public dynamicAnimations: Animation[] = [];
    private particleHandler: ParticleHandler;
    private textureMapper = TextureMapper.getInstance();
    private renderHelper = RenderHelper.getInstance();

    constructor(particleHandler: ParticleHandler) {
        this.particleHandler = particleHandler;
    }

    public bloodAnimation_A(position: Vector, size: number) {
        let animation = new Animation();
        animation.textureNumber.push(100);
        animation.textureNumber.push(101);
        animation.textureNumber.push(102);
        animation.textureNumber.push(103);
        animation.textureNumber.push(104);
        animation.textureNumber.push(105);
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public bloodAnimation_B_Right(position: Vector, size: number) {
        let animation = new Animation();
        animation.textureNumber.push(106);
        animation.textureNumber.push(107);
        animation.textureNumber.push(108);
        animation.textureNumber.push(109);
        animation.textureNumber.push(110);
        animation.textureNumber.push(111);
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public bloodAnimation_B_Left(position: Vector, size: number) {
        let animation = new Animation();
        animation.textureNumber.push(106);
        animation.textureNumber.push(107);
        animation.textureNumber.push(108);
        animation.textureNumber.push(109);
        animation.textureNumber.push(110);
        animation.textureNumber.push(111);
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.inverse = true;

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public voidAnimation() {
        let animation = new Animation();

        animation.areaToRender = new Rectangle(0, 0, 0, 0);

        return animation;
    }

    public bloodAnimation_C(position: Vector, size: number) {
        let animation = new Animation();
        animation.textureNumber.push(147);
        animation.textureNumber.push(148);
        animation.textureNumber.push(149);
        animation.textureNumber.push(150);
        animation.textureNumber.push(151);
        animation.textureNumber.push(152);
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public swordman_death(position: Vector, inverse: boolean) {
        let animation = new Animation();
        animation.textureNumber.push(214);
        animation.textureNumber.push(216);
        animation.textureNumber.push(217);
        animation.textureNumber.push(218);

        animation.timeToChange = 120;

        animation.repetitions = 4;

        animation.areaToRender = new Rectangle(position.x, position.y, 56, 59);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }

    public createArcherDeath(area: Rectangle, inverse: boolean) {
        this.bloodAnimation_C(new Vector(area.x - 10, area.y - 20), 75);
        this.bloodAnimation_B_Left(new Vector(area.x - 10, area.y - 20), 75);
        this.bloodAnimation_B_Right(new Vector(area.x - 10, area.y - 20), 75);
        this.archer_death(area, inverse);
        this.archer_corpse(area, inverse);
    }

    public archer_death(area: Rectangle, inverse: boolean) {
        let animation = new Animation();
        animation.textureNumber.push(290);
        animation.textureNumber.push(291);
        animation.textureNumber.push(292);
        animation.textureNumber.push(293);

        animation.timeToChange = 120;

        animation.repetitions = 4;

        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }

    public archer_corpse(area: Rectangle, inverse: boolean) {
        let animation = new Animation();
        animation.textureNumber.push(293);
        animation.timeToChange = 120;

        animation.delay = 4;

        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }

    public player_sword_death_corpse(position: Vector, inverse: boolean) {
        let animation = new Animation();
        animation.textureNumber.push(306);
        animation.timeToChange = 150;
        animation.delay = 6;

        animation.areaToRender = new Rectangle(position.x, position.y, 90, 90);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }

    public player_sword_death_animation(position: Vector, inverse: boolean) {
        let animation = new Animation();
        animation.textureNumber.push(301);
        animation.textureNumber.push(302);
        animation.textureNumber.push(303);
        animation.textureNumber.push(304);
        animation.textureNumber.push(305);
        animation.textureNumber.push(306);
        animation.inverse = inverse;
        animation.timeToChange = 150;
        animation.repetitions = 6;
        animation.areaToRender = new Rectangle(position.x, position.y, 90, 90);

        this.animations.push(animation);

        return animation;
    }

    public shadow_Death(area: Rectangle, inverse: boolean) {
        let animation = new Animation();
        animation.textureNumber.push(132);
        animation.textureNumber.push(130);
        animation.textureNumber.push(127);
        animation.textureNumber.push(124);
        animation.textureNumber.push(119);

        animation.repetitions = 4;
        animation.inverse = inverse;
        animation.timeToChange = 100;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        this.animations.push(animation);

        return animation;
    }

    public swordman_corpse(position: Vector, inverse: boolean) {
        let animation = new Animation();
        animation.textureNumber.push(219);

        animation.timeToChange = 120;

        animation.delay = 4;

        animation.areaToRender = new Rectangle(position.x, position.y, 56, 59);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }

    public swordman_head(position: Vector, inverse: boolean) {
        let animation = new Animation();
        animation.textureNumber.push(215);
        animation.textureNumber.push(220);
        animation.textureNumber.push(221);
        animation.textureNumber.push(222);
        animation.textureNumber.push(223);
        animation.textureNumber.push(224);
        animation.textureNumber.push(225);
        animation.textureNumber.push(226);

        animation.timeToChange = 75;
        animation.areaToRender = new Rectangle(position.x, position.y, 56, 59);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }

    

    public createSpellAnimation(position: Vector, animationSize: number, inverse: boolean, type: SpellType) {
        switch (type) {
            case SpellType.fireball: return this.fireball(position, animationSize, inverse);
            case SpellType.electricbolt: return this.electricbolt(position, animationSize, inverse);
        }
    }

    public sizzle(position: Vector, size: number) {
        let animation = new Animation();
        animation.textureNumber.push(137);
        animation.textureNumber.push(138);
        animation.textureNumber.push(139);
        animation.textureNumber.push(140);
        animation.textureNumber.push(141);
        animation.textureNumber.push(142);
        animation.textureNumber.push(143);
        animation.textureNumber.push(144);
        animation.textureNumber.push(145);
        animation.textureNumber.push(146);
        animation.timeToChange = 70;
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.repetitions = 10;

        this.animations.push(animation);

        return animation;
    }

    public fireball_destroy(position: Vector, size: number) {
        let animation = new Animation();
        animation.textureNumber.push(118);
        animation.textureNumber.push(119);
        animation.textureNumber.push(120);
        animation.textureNumber.push(121);
        animation.textureNumber.push(122);
        animation.textureNumber.push(123);
        animation.textureNumber.push(124);
        animation.textureNumber.push(125);
        animation.textureNumber.push(126);
        animation.timeToChange = 50;
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.repetitions = 9;

        this.animations.push(animation);

        return animation;
    }

    public fireball_explosion(position: Vector, size: number) {
        this.particleHandler.createFireballExplosion(position, size);
    }

    public swordscut_a(position: Vector, size: number, inverse: boolean) {

        let animation = new Animation();
        animation.textureNumber.push(153);
        animation.textureNumber.push(154);
        animation.textureNumber.push(155);
        animation.textureNumber.push(156);
        animation.textureNumber.push(157);
        animation.inverse = inverse;
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        this.animations.push(animation);

        animation.repetitions = 5;

        return animation;
    }

    public createDebugAnimation(position: Vector, size: number, repetitions: number) {
        let animation = new Animation();
        animation.textureNumber.push(5);
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

        let animation = new FrameAnimation(0, -4, 0, 0, onUpdate);
        animation.textureNumber.push(250);
        animation.textureNumber.push(251);
        animation.textureNumber.push(252);
        animation.textureNumber.push(253);
        animation.textureNumber.push(254);
        animation.textureNumber.push(255);
        animation.textureNumber.push(256);
        animation.textureNumber.push(257);

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

        let animation = new FrameAnimation(0, -4, 0, 0, onUpdate);
        animation.textureNumber.push(282);
        animation.textureNumber.push(283);
        animation.textureNumber.push(284);
        animation.textureNumber.push(285);
        animation.textureNumber.push(286);
        animation.textureNumber.push(287);
        animation.textureNumber.push(288);
        animation.textureNumber.push(289);

        animation.inverse = inverse;
        animation.timeToChange = 100;
        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.repetitions = 8;

        this.animations.push(animation);

        return animation;
    }

    public createArrow(area: Rectangle, inverse: boolean, velocity: Vector) {
        let animation = new RotationAnimation(velocity);
        animation.textureNumber.push(268);
        animation.inverse = inverse;
        animation.areaToRender = area;

        animation.timeToChange = 20000;
        animation.repetitions = 1;

        this.dynamicAnimations.push(animation);

        return animation;
    }

    public createDeadArrow(area: Rectangle, inverse: boolean, velocity: Vector) {
        let collAngle = new Vector(velocity.x, velocity.y);

        let animation = new StaticRotationAnimation(collAngle, inverse);
        animation.textureNumber.push(268);
        animation.inverse = inverse;

        animation.areaToRender = new Rectangle(area.x, area.y, area.width, area.height);

        animation.timeToChange = 2000;
        animation.repetitions = 1;

        this.dynamicAnimations.push(animation);

        return animation;
    }

    public createArrowHit(projectile: Projectile, useCollisionArea: boolean) {

        let collAngle = new Vector(projectile.velocity.x, projectile.velocity.y);

        let animation = new RotationAnimation(collAngle);
        animation.textureNumber.push(269);
        animation.inverse = projectile.animation.inverse;

        if(useCollisionArea) {
            animation.areaToRender = new Rectangle(projectile.collisionArea.x, projectile.collisionArea.y, projectile.area.width, projectile.area.height);
        } else {
            animation.areaToRender = new Rectangle(projectile.area.x, projectile.area.y, projectile.area.width, projectile.area.height);
        }
        
        animation.areaToRender.width = animation.areaToRender.width * 0.67;

        animation.timeToChange = 2000;
        animation.repetitions = 1;


        this.dynamicAnimations.push(animation);

        return animation;
    }

    public frozenSwordMan(area: Rectangle, inverse: boolean, color: number[], onCompletion: () => void) {
        let animation = new Animation();
        animation.textureNumber.push(237);
        animation.textureNumber.push(238);
        animation.textureNumber.push(239);
        animation.textureNumber.push(240);
        animation.textureNumber.push(241);
        animation.textureNumber.push(242);
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
        let animation = new Animation();
        animation.textureNumber.push(270);
        animation.textureNumber.push(271);
        animation.textureNumber.push(272);
        animation.textureNumber.push(273);
        animation.textureNumber.push(274);
        animation.textureNumber.push(275);
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
        let animation = new Animation();
        animation.textureNumber.push(baseTextureNumber + partIndex);
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

                renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, animation.getCurrentFrame());
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

                renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, animation.getCurrentFrame());

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
        let animation = new Animation();
        animation.textureNumber.push(209);
        animation.textureNumber.push(211);
        animation.textureNumber.push(210);

        animation.timeToChange = 120;
        animation.areaToRender = new Rectangle(position.x, position.y, 56, 58);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }

    private fireball(position: Vector, size: number, inverse: boolean) {
        let animation = new Animation();
        animation.textureNumber.push(112);
        animation.textureNumber.push(113);
        animation.textureNumber.push(114);
        animation.textureNumber.push(115);
        animation.textureNumber.push(116);
        animation.textureNumber.push(117);
        animation.timeToChange = 50;
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }

    private electricbolt(position: Vector, size: number, inverse: boolean) {
        let animation = new Animation();
        animation.textureNumber.push(127);
        animation.textureNumber.push(128);
        animation.textureNumber.push(129);
        animation.textureNumber.push(130);
        animation.textureNumber.push(131);
        animation.textureNumber.push(132);
        animation.textureNumber.push(133);
        animation.textureNumber.push(134);
        animation.textureNumber.push(135);
        animation.textureNumber.push(136);
        animation.timeToChange = 50;
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.inverse = inverse;

        this.animations.push(animation);

        return animation;
    }



}