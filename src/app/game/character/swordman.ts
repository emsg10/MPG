import { Enemy } from './enemy';
import { Player } from './player';
import { Context } from '../context';
import { Vector, Rectangle, Tile, Meele, Animation, SpellType } from '../model';
import { TextureMapper } from '../render/textureMapper';
import { AnimationHandler } from '../handler/animationHandler';
import { ProjectileHandler } from '../handler/projectileHandler';
import { DeathType } from './deathType';
import { State } from './state';
import { DebugHandler } from "../handler/debugHandler";

export class Swordman extends Enemy {

    public hitCollisionAreas: Rectangle[] = [];
    protected hitAreaOffset: number = 100;
    protected searchAreaOffset: number = 600;
    protected hitting = false;
    protected trackingSpeed = 0.2;
    protected idleSpeed = 0.1;
    protected minDistance = 5;
    private textureMapper = TextureMapper.getInstance();
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler;
    private meeleAnimation: Animation;
    private hitOffset = 40;
    

    constructor(position: Vector, width: number, height: number, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler) {
        super(position, width, height);
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;
        this.maxSpeed = 0.1;
        this.actualSpeed = this.maxSpeed;

        this.idleAnimation = new Animation([228, 227, 229, 227]);

        this.idleAnimation.timeToChange = 150;

        this.hitAnimation = new Animation([231, 231, 232, 230, 212]);
        
        this.trackingAnimation = new Animation([211, 209, 211, 210]);

        
    }

    public takeDamage(damage: number, type: SpellType) {
        super.takeDamage(damage, type);
        if(this.damageAudioTimer <= 0) {
            this.animationHandler.audioHandler.playSound("swordmanhit.wav", 1, 0, 0.1);
            this.damageAudioTimer = this.damageAudioTimerValue;
        }
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        
        super.update(delta, tiles, player);
        this.npcAction(delta, player, tiles);

        if (this.currentAnimation == this.hitAnimation) {
            this.currentAnimation.next(delta);
        } else {
            if (this.velocity.x != 0 || this.collisionData.wallCollision) {
                this.currentAnimation.next(delta);
            }
        }

        this.setHitAnimation();
        this.checkHitCollisionAreas(player);

        
    }

    private checkHitCollisionAreas(player: Player) {
        if (this.hitAnimation) {
            if (this.hitAnimation.frameIndex == 1 && !this.hitting) {
                this.hitting = true;
                this.projectileHandler.createCollisionProjectile(this.position, this.width, this.inverse, 30, new Vector(0.5, 0.6));
            }

            if (this.hitAnimation.frameIndex == 0) {
                this.hitting = false;
            }
        }
    }

    protected idle(delta: number, player: Player, tiles: Tile[]) {
        super.idle(delta, player, tiles);
        this.patrol(delta);
    }

    protected idleToTrackingTransition(delta: number) {
        this.currentState = State.Tracking;
        this.maxSpeed = this.trackingSpeed;
        this.actualSpeed = this.maxSpeed;
    }

    protected trackingToInRangeTransition(delta: number) {
        this.currentState = State.InHitRange;
    }

    protected trackingToIdleTransition(delta: number) {
        this.maxSpeed = this.idleSpeed;
        this.actualSpeed = this.maxSpeed;
        this.currentState = State.Idle;
    }

    protected track(player: Player, delta: number, tiles: Tile[], gapSize: number) {
        this.actualSpeed = this.trackingSpeed;
        super.track(player, delta, tiles, gapSize);
    }

    protected inRange(player: Player, offset: number, tiles: Tile[]) {

        
        let deltaPos: Vector;
        if(this.inverse) {
            deltaPos = this.getDeltaPosition(player, 50, 0);
        } else {
            deltaPos = this.getDeltaPosition(player, 0, 0);
        }
        
        let magnitude = deltaPos.magnitude();

        if (magnitude < offset) {
            if (this.clearShoot(deltaPos, tiles)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }

    protected hit(delta: number, player: Player, tiles: Tile[]) {
        this.actualSpeed = 0;
        super.hit(delta, player, tiles);
        if (this.meeleAnimation) {
            if (this.meeleAnimation.repetitions <= 0) {
                this.createHit(player);
            }
        } else {
            this.createHit(player);
        }
    }

    private createHit(player: Player) {
        this.animationHandler.audioHandler.playSound("swing3.wav", 1, 0, 0.1);
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

    public getCollisionArea() {
        let collisionArea = new Rectangle(this.position.x + 10, this.position.y, this.width - 20, 55);

        return collisionArea;
    }

}