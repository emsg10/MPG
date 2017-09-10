import { Enemy } from './enemy';
import { Player } from './player';
import { Context } from '../context';
import { Vector, Rectangle, Tile, Meele, Animation, SpellType, DebugElement } from '../model';
import { TextureMapper } from '../render/textureMapper';
import { AnimationHandler } from '../handler/animationHandler';
import { ProjectileHandler } from '../handler/projectileHandler';
import { ParticleHandler } from '../handler/particleHandler';
import { DebugHandler } from '../handler/debugHandler';
import { DeathType } from './deathType';
import { State } from './state';

export class Screamer extends Enemy {

    protected hitAreaOffset: number = 500;
    protected searchAreaOffset: number = 500;
    protected hp = 200;
    protected hitDamage = 50;
    protected trackingSpeed = 0.4;
    protected idleSpeed = 0.1;
    protected minDistance = 30;
    private textureMapper = TextureMapper.getInstance();
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler;
    private projectileVelocity = 0.5;
    private onBlackFireUpdate = (area: Rectangle, inverse: boolean, offsetX: number) => {
        this.particleHandler.createNecroFireBall(new Vector(area.x, area.y), area.width, inverse, offsetX);
    };
    private hitTimer: number = 0;
    private chargeTimer: number = 1000;


    public debugHandler = DebugHandler.getInstance();

    constructor(position: Vector, width: number, height: number, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler, private particleHandler: ParticleHandler) {
        super(position, width, height);
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;

        this.acceleration = 0.1;

        this.idleAnimation = new Animation([560, 561, 562, 563, 564, 565, 566, 567]);
        this.idleAnimation.timeToChange = 175;

        this.trackingAnimation = new Animation([568, 569, 570, 571, 572, 573, 574, 575]);

        this.trackingAnimation.timeToChange = 175;

        this.hitAnimation = new Animation([568, 569, 570, 571, 572, 573, 574, 575]);

        this.hitAnimation.timeToChange = 250;

        this.currentAnimation = this.hitAnimation;


    }

    public update(delta: number, tiles: Tile[], player: Player) {
        super.update(delta, tiles, player);

        this.currentAnimation.next(delta);

        if(this.hitTimer > 0){
            this.hitTimer -= delta;
        }

        this.npcAction(delta, player, tiles);
    }

    public getCollisionArea() {
        let collisionArea: Rectangle;

        collisionArea = new Rectangle(this.position.x + 15, this.position.y, this.width - 30, this.height - 10);

        return collisionArea;
    }

    protected hit(delta: number, player: Player, tiles: Tile[]) {
        super.hit(delta, player, tiles);
        if (this.hitTimer <= 0) {
            if (this.collisionDetection.aabbCheck(this.getCollisionArea(), player.getCollisionArea())) {
                this.hitTimer = 500;
                this.chargeTimer = 1000;
                this.currentState = State.Idle;
                player.takeDamage(this.hitDamage);
                if (player.position.x < this.position.x) {
                    player.hardHit(false, 0.8);
                } else {
                    player.hardHit(true, 0.8);
                }
            }
        }
    }

    protected idle(delta: number, player: Player, tiles: Tile[]) {
        super.idle(delta, player, tiles);
        this.actualSpeed = this.maxSpeed;
        this.patrol(delta);
    }

    protected idleToTrackingTransition(delta: number) {
        this.currentAnimation = this.trackingAnimation;

        if (this.chargeTimer > 0) {
            this.chargeTimer -= delta;
        } else {
            this.currentState = State.Tracking;
            this.animationHandler.audioHandler.playSound("soundseffects.ogg", 2, 0.5, 0.8);
        }
    }

    protected trackingToInRangeTransition(delta: number) {
        this.currentState = State.InHitRange;
    }

    protected trackingToIdleTransition(delta: number) {
        this.currentState = State.Idle;
    }

    protected track(player: Player, delta: number, tiles: Tile[]) {
        super.track(player, delta, tiles, 30);
        this.setFreezeSpeed();
    }

    protected inRange(player: Player, offset: number, tiles: Tile[]) {

        let deltaPos = this.getDeltaPosition(player, 10, 0);
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

    protected moveToPlayer(delta: number, player: Player, tiles: Tile[], gapSize: number) {
        let positionMiddle = this.position.x + (this.width / 2);
        if (Math.abs(player.middlePosition.x - positionMiddle) > gapSize) {
            if (player.middlePosition.x < positionMiddle) {
                this.moveLeft(delta);
            } else if (player.middlePosition.x > positionMiddle) {
                this.moveRight(delta);
            }
        } else {
            this.currentState = State.Idle;
            this.chargeTimer = 1000;
        }
    }

}