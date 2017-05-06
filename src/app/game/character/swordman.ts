import { Enemy } from './enemy';
import { Player } from './player';
import { Context } from '../context';
import { Vector, Rectangle, Tile, Meele, Animation, SpellType } from '../model';
import { TextureMapper } from '../render/textureMapper';
import { AnimationHandler } from '../handler/animationHandler';
import { ProjectileHandler } from '../handler/projectileHandler';
import { DeathType } from './deathType';

export class Swordman extends Enemy {

    public hitCollisionAreas: Rectangle[] = [];
    private textureMapper = TextureMapper.getInstance();
    private collisionArea: Rectangle;
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler;
    private meeleAnimation: Animation;
    private hitOffset = 40;
    private hitting = false;

    constructor(position: Vector, width: number, height: number, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler) {
        super(position, width, height);
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;
        this.maxSpeed = 0.1;
        this.actualSpeed = this.maxSpeed;

        this.runningAnimation.textureNumber.push(228);
        this.runningAnimation.textureNumber.push(227);
        this.runningAnimation.textureNumber.push(229);
        this.runningAnimation.textureNumber.push(227);

        this.runningAnimation.timeToChange = 150;

        this.hitAnimation.textureNumber.push(231);
        this.hitAnimation.textureNumber.push(231);
        this.hitAnimation.textureNumber.push(232);
        this.hitAnimation.textureNumber.push(230);
        this.hitAnimation.textureNumber.push(212);

        this.trackingAnimation.textureNumber.push(211);
        this.trackingAnimation.textureNumber.push(209);
        this.trackingAnimation.textureNumber.push(211);
        this.trackingAnimation.textureNumber.push(210);

        this.currentAnimation = this.runningAnimation;
    }

    public takeDamage(damage: number, type: SpellType) {
        super.takeDamage(damage, type);
        if (!this.tracking) {
            this.startTracking();
        }
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        super.update(delta, tiles, player);

        if (this.currentAnimation == this.hitAnimation) {
            this.currentAnimation.next(delta);
        } else {
            if (this.velocity.x != 0 || this.collisionData.wallCollision) {
                this.currentAnimation.next(delta);
            }
        }

        this.setHitAnimation();
        this.checkHitCollisionAreas(player);

        this.npcAction(delta, player, tiles);
    }

    private checkHitCollisionAreas(player: Player) {
        if (this.hitAnimation) {
            if (this.hitAnimation.frameIndex == 4 && !this.hitting) {
                this.hitting = true;
                this.projectileHandler.createSwordHit(this.position, this.width, this.inverse);
            }

            if (this.hitAnimation.frameIndex == 0) {
                this.hitting = false;
            }
        }
    }

    protected inRange(player: Player, offset: number) {

        let area: Rectangle;

        if (this.inverse) {
            area = new Rectangle(this.position.x - offset, this.position.y, offset, this.height);
        } else {
            area = new Rectangle(this.position.x, this.position.y, offset + this.width, this.height);
        }

        return this.collisionDetection.aabbCheck(area, player.getCollisionArea());

    }

    protected hit(player: Player) {
        if (this.meeleAnimation) {
            if (this.meeleAnimation.repetitions <= 0) {
                this.createHit(player);
            }
        } else {
            this.createHit(player);
        }
    }

    private createHit(player: Player) {
        if (player.getShieldCollidables.length <= 0) {
            if (!this.inverse) {
                this.meeleAnimation = this.animationHandler.swordscut_a(new Vector(this.position.x + this.hitOffset, this.position.y), 50, !this.inverse);
            } else {
                this.meeleAnimation = this.animationHandler.swordscut_a(new Vector(this.position.x - this.hitOffset, this.position.y), 50, !this.inverse);
            }
        }
    }

    private setHitAnimation() {
        if (this.meeleAnimation) {
            if (!this.inverse) {
                this.meeleAnimation.areaToRender.x = this.position.x + this.hitOffset;
                this.meeleAnimation.areaToRender.y = this.position.y;
            } else {
                this.meeleAnimation.areaToRender.x = this.position.x - this.hitOffset;
                this.meeleAnimation.areaToRender.y = this.position.y;
            }
        }
    }

    public getCollisionArea() {
        let collisionArea = new Rectangle(this.position.x + 10, this.position.y, this.width - 20, 55);

        return collisionArea;
    }

}