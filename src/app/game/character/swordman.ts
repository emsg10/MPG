import { Enemy } from './enemy';
import { Player } from './player';
import { Context } from '../context';
import { Vector, Rectangle, Tile, Meele, Animation } from '../model';
import { TextureMapper } from '../render/textureMapper';
import { AnimationHandler } from '../handler/animationHandler';
import { ProjectileHandler } from '../handler/projectileHandler';

export class Swordman extends Enemy {

    public hitCollisionAreas: Rectangle[] = [];
    private textureMapper = TextureMapper.getInstance();
    private collisionArea: Rectangle;
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler;
    private meeleAnimation: Animation;
    private hitOffset = 40;

    constructor(position: Vector, width: number, height: number, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler) {
        super(position, width, height);
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;
        this.maxSpeed = 0.1;

        this.runningAnimation.textureNumber.push(209);
        this.runningAnimation.textureNumber.push(211);
        this.runningAnimation.textureNumber.push(210);
        this.runningAnimation.textureNumber.push(211);
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        super.update(delta, tiles, player);
        this.setHitAnimation();
        this.checkHitCollisionAreas(player);

        this.npcAction(delta);
    }

    private checkHitCollisionAreas(player: Player) {
        this.hitCollisionAreas = [];
        if (this.meeleAnimation) {
            if (this.meeleAnimation.repetitions > 0) {
                if (this.meeleAnimation.repetitions == 5 || this.meeleAnimation.repetitions == 4) {
                    if (!this.inverse) {
                        this.hitCollisionAreas.push(new Rectangle(this.position.x + this.hitOffset, this.position.y, 5, 5));
                        this.hitCollisionAreas.push(new Rectangle(this.position.x + this.hitOffset + 15, this.position.y + 10, 5, 5));
                        this.hitCollisionAreas.push(new Rectangle(this.position.x + this.hitOffset + 25, this.position.y + 20, 5, 5));
                        this.hitCollisionAreas.push(new Rectangle(this.position.x + this.hitOffset + 35, this.position.y + 30, 5, 5));                        
                        this.hitCollisionAreas.push(new Rectangle(this.position.x + this.hitOffset + 40, this.position.y + 40, 5, 5));
                    } else {
                        this.hitCollisionAreas.push(new Rectangle(this.position.x, this.position.y, 5, 5));
                        this.hitCollisionAreas.push(new Rectangle(this.position.x - 15, this.position.y + 10, 5, 5));
                        this.hitCollisionAreas.push(new Rectangle(this.position.x - 25, this.position.y + 20, 5, 5));
                        this.hitCollisionAreas.push(new Rectangle(this.position.x - 35, this.position.y + 30, 5, 5));                        
                        this.hitCollisionAreas.push(new Rectangle(this.position.x - 40, this.position.y + 40, 5, 5));
                    }
                }

                if(this.collisionDetection.aabbCheckS(player.getCollisionArea(), this.hitCollisionAreas)) {
                    player.dead = true;
                }

            } else {
                this.meeleAnimation = null;
            }
        }
    }

    private npcAction(delta: number) {
        if (this.oldDirection != this.direction) {
            this.oldDirection = this.direction;
        }

        this.hit();

        if (this.oldDirection) {
            this.moveLeft(delta);

        } else {
            this.moveRight(delta);
        }


    }

    private hit() {
        if (this.meeleAnimation) {
            if (this.meeleAnimation.repetitions <= 0) {
                this.createHit();
            }
        } else {
            this.createHit();
        }
    }

    private createHit() {
        if (!this.inverse) {
            this.meeleAnimation = this.animationHandler.swordscut_a(new Vector(this.position.x + this.hitOffset, this.position.y), 50, !this.inverse);
        } else {
            this.meeleAnimation = this.animationHandler.swordscut_a(new Vector(this.position.x - this.hitOffset, this.position.y), 50, !this.inverse);
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

}