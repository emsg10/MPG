import { Enemy } from './enemy';
import { Player } from './player';
import { Context } from '../context';
import { Vector, Rectangle, Tile, Meele, Animation, SpellType, DebugElement, ProjectileType } from '../model';
import { TextureMapper } from '../render/textureMapper';
import { AnimationHandler } from '../handler/animationHandler';
import { ProjectileHandler } from '../handler/projectileHandler';
import { ParticleHandler } from '../handler/particleHandler';
import { DebugHandler } from '../handler/debugHandler';
import { DeathType } from './deathType';
import { State } from './state';

export class MasterSorcerer extends Enemy {

    protected hitAreaOffset: number = 400;
    protected searchAreaOffset: number = 800;
    protected hp = 500;
    protected trackingSpeed = 0.1;
    protected idleSpeed = 0.1;
    protected minDistance = 30;
    private channelAnimation: Animation;
    private channelHitTransitionAnimation: Animation;
    private textureMapper = TextureMapper.getInstance();
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler;
    private projectileVelocity = 0.5;
    private shoot = false;
    private onBlackFireUpdate = (area: Rectangle, inverse: boolean, offsetX: number) => {
        this.particleHandler.createNecroFireBall(new Vector(area.x, area.y), area.width, inverse, offsetX);
    };
    private defaultChannelTime = 1500;
    private shootDefaultCooldown = 100;
    private shootCooldown = this.shootDefaultCooldown;
    private channelTimer = this.defaultChannelTime;
    private shootsFired = 0;
    private maxShoots = 10;

    public debugHandler = DebugHandler.getInstance();

    constructor(position: Vector, width: number, height: number, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler, private particleHandler: ParticleHandler) {
        super(position, width, height);
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;

        this.idleAnimation = new Animation([580, 581, 582, 583, 584, 585]);
        this.idleAnimation.timeToChange = 175;

        this.trackingAnimation = new Animation([580, 581, 582, 583, 584, 585]);

        this.trackingAnimation.timeToChange = 175;

        this.channelHitTransitionAnimation = new Animation([585, 597, 598]);

        this.channelHitTransitionAnimation.timeToChange = 150;

        this.hitAnimation = new Animation([598]);

        this.hitAnimation.timeToChange = 150;

        this.channelAnimation = new Animation([585]);

        this.currentAnimation = this.hitAnimation;


    }

    public update(delta: number, tiles: Tile[], player: Player) {
        super.update(delta, tiles, player);

        this.currentAnimation.next(delta);

        this.npcAction(delta, player, tiles);
    }

    public getCollisionArea() {
        let collisionArea: Rectangle;

        collisionArea = new Rectangle(this.position.x + 25, this.position.y + 35, this.width - 50, this.height - 40);

        return collisionArea;
    }

    protected track(player: Player, delta: number, tiles: Tile[], gapSize: number) {
        super.track(player, delta, tiles, gapSize);
        this.setFreezeSpeed();
    }

    protected hit(delta: number, player: Player, tiles: Tile[]) {
        if (!this.inRange(player, this.hitAreaOffset, tiles) && this.hitAnimation.frameIndex == 0) {
            this.currentState = State.Tracking;
        }

        this.moveToPlayer(delta, player, tiles, 10);
        this.actualSpeed = 0;

        if (this.channel(delta)) {
            this.currentAnimation = this.channelAnimation;
            this.particleHandler.createNecroChannelMagic(this.position, this.inverse, 101, 10, 27, 10);
        } else if (this.channelHitTransitionAnimation.frameIndex != 2) {
            this.currentAnimation = this.channelHitTransitionAnimation;
        } else {
            this.currentAnimation = this.hitAnimation;

            if (this.shootCooldown <= 0) {
                if (this.shootsFired < this.maxShoots) {
                    this.shootsFired++;
                    let velocity = this.getDeltaPosition(player, 0, this.rand(0, 50));
                    velocity.y = velocity.y + 20;
                    velocity.normalize();
                    velocity.multiply(this.projectileVelocity);
                    let pos: Vector
                    if(this.inverse) {
                        pos = new Vector(this.position.x - 18, this.position.y + 20);
                    } else {
                        pos = new Vector(this.position.x + 80, this.position.y + 20);
                    }
                    
                    this.projectileHandler.createNecroBall(pos, 25, this.inverse, velocity, 10, 40, ProjectileType.NecroBall, this.onBlackFireUpdate);
                } else {
                    this.shootsFired = 0;
                    this.channelTimer = this.defaultChannelTime;
                    this.channelHitTransitionAnimation.reset();
                }

                this.shootCooldown = this.shootDefaultCooldown;
            } else {
                this.shootCooldown -= delta;
            }


        }
    }

    protected idle(delta: number, player: Player, tiles: Tile[]) {
        super.idle(delta, player, tiles);
        this.actualSpeed = this.maxSpeed;
        this.patrol(delta);
    }

    protected idleToTrackingTransition(delta: number) {
        this.currentState = State.Tracking;
    }

    protected trackingToInRangeTransition(delta: number) {
        this.currentState = State.InHitRange;
    }

    protected trackingToIdleTransition(delta: number) {
        this.currentState = State.Idle;
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

    private channel(delta: number) {

        this.channelTimer -= delta;

        if (this.channelTimer <= 0) {
            return false;
        } else {
            return true;
        }

    }
}