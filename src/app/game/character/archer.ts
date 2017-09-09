import { Enemy } from './enemy';
import { Player } from './player';
import { Context } from '../context';
import { Vector, Rectangle, Tile, Meele, Animation, SpellType, DebugElement } from '../model';
import { TextureMapper } from '../render/textureMapper';
import { AnimationHandler } from '../handler/animationHandler';
import { ProjectileHandler } from '../handler/projectileHandler';
import { DebugHandler } from '../handler/debugHandler';
import { DeathType } from './deathType';
import { State } from './';

export class Archer extends Enemy {

    private textureMapper = TextureMapper.getInstance();
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler;
    protected hitAreaOffset: number = 600;
    protected searchAreaOffset: number = 800;
    protected hp = 50;
    private arrowVelocity = 0.5;
    private shoot = false;
    public debugHandler = DebugHandler.getInstance();

    constructor(position: Vector, width: number, height: number, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler) {
        super(position, width, height);
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;

        this.maxSpeed = 0.1;
        this.actualSpeed = this.maxSpeed;

        this.idleAnimation = new Animation([267, 266, 267, 265]);

        this.hitAnimation = new Animation([262, 264, 263, 264]);

        this.trackingAnimation = new Animation([267, 266, 267, 265]);

        this.trackingAnimation.timeToChange = 175;

        this.hitAnimation.timeToChange = 300;

        this.currentAnimation = this.hitAnimation;

        this.idleAnimation.timeToChange = 175;
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        this.npcAction(delta, player, tiles);
        super.update(delta, tiles, player);

        this.currentAnimation.next(delta);
    }

    public getCollisionArea() {
        let collisionArea = new Rectangle(this.position.x + 10, this.position.y - 5, this.width - 20, 55);

        return collisionArea;
    }

    public takeDamage(damage: number, type: SpellType) {
        super.takeDamage(damage, type);
        if(this.damageAudioTimer <= 0) {
            this.animationHandler.audioHandler.playSound("swordmanhit.wav", 1, 0, 0.1);
            this.damageAudioTimer = this.damageAudioTimerValue;
        }
    }

    protected idle(delta: number, player: Player, tiles: Tile[]) {
        super.idle(delta, player, tiles);
        this.patrol(delta);
    }

    protected hit(delta: number, player: Player, tiles: Tile[]) {
        super.hit(delta, player, tiles);

        if(this.hitAnimation.frameIndex == 3) {
            if(!this.shoot) {
                this.shoot = true;
                let velocity = this.calculatePath(player, this.inverse);
                let bowPosition = new Vector(this.position.x, this.position.y + 20); 
                this.projectileHandler.createArrow(bowPosition, this.inverse, velocity);
            }
        } else {
            this.shoot = false;
        }
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
        
        if(magnitude < this.searchAreaOffset) {
            if(this.clearShoot(deltaPos, tiles)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    
    private getDeltaVelocity(player: Player, deltaPos: Vector) {
        
        let velocity = player.getVelocity();
        let deltaVelocity = velocity.x * velocity.x * 800;
        if(deltaPos.x < 0) {
            if(velocity.x > 0) {
                return -deltaVelocity;
            } else {
                return deltaVelocity;
            }
        } else {
            if(velocity.x > 0) {
                return deltaVelocity;
            } else {
                return -deltaVelocity;
            }
        }
        
    }

    private calculatePath(player: Player, inverse: boolean) {
        let deltaPos = this.getDeltaPosition(player, 10, 0);

        deltaPos.y = deltaPos.y - ((deltaPos.x * deltaPos.x * 0.00063) + this.getDeltaVelocity(player, deltaPos));
        
        let velocity = new Vector(deltaPos.x, deltaPos.y * this.rand(0.85, 1.15));
        velocity.normalize();
        velocity.multiply(this.arrowVelocity);
        return velocity;
    }

}