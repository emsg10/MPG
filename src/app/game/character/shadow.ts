import { Enemy } from './enemy';
import { Player } from './player';
import { Context } from '../context';
import { Vector, Rectangle, Tile, Meele, Animation, SpellType, DebugElement } from '../model';
import { TextureMapper } from '../render/textureMapper';
import { AnimationHandler } from '../handler/animationHandler';
import { ProjectileHandler } from '../handler/projectileHandler';
import { DebugHandler } from '../handler/debugHandler';
import { DeathType } from './deathType';
import { State } from './state';

export class Shadow extends Enemy {

    private textureMapper = TextureMapper.getInstance();
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler;
    protected hitAreaOffset: number = 100;
    protected searchAreaOffset: number = 100;
    protected hp = 300;
    protected trackingSpeed = 0.2;
    protected idleSpeed = 0;
    protected minDistance = 30;
    public debugHandler = DebugHandler.getInstance();

    constructor(position: Vector, width: number, height: number, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler) {
        super(position, width, height);
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;

        this.idleAnimation.textureNumber.push(118);

        this.idleToTrackingAnimation.textureNumber.push(119);
        this.idleToTrackingAnimation.textureNumber.push(120);
        this.idleToTrackingAnimation.textureNumber.push(121);
        this.idleToTrackingAnimation.textureNumber.push(122);
        this.idleToTrackingAnimation.textureNumber.push(123);
        this.idleToTrackingAnimation.textureNumber.push(124);
        this.idleToTrackingAnimation.textureNumber.push(125);
        this.idleToTrackingAnimation.textureNumber.push(126);
        this.idleToTrackingAnimation.textureNumber.push(127);
        this.idleToTrackingAnimation.textureNumber.push(128);
        this.idleToTrackingAnimation.textureNumber.push(129);
        this.idleToTrackingAnimation.textureNumber.push(130);
        this.idleToTrackingAnimation.textureNumber.push(131);
        this.idleToTrackingAnimation.textureNumber.push(132);

        this.idleToTrackingAnimation.repetitions = 13;
        this.idleToTrackingAnimation.timeToChange = 50;

        this.trackingToIdleTransitionAnimation.textureNumber.push(132);
        this.trackingToIdleTransitionAnimation.textureNumber.push(130);
        this.trackingToIdleTransitionAnimation.textureNumber.push(127);
        this.trackingToIdleTransitionAnimation.textureNumber.push(124);
        this.trackingToIdleTransitionAnimation.textureNumber.push(119);

        this.trackingToIdleTransitionAnimation.repetitions = 4;

        this.trackingAnimation.textureNumber.push(133);
        this.trackingAnimation.textureNumber.push(134);
        this.trackingAnimation.textureNumber.push(135);

        this.hitAnimation.textureNumber.push(136);
        this.hitAnimation.textureNumber.push(136);
        this.hitAnimation.textureNumber.push(137);
        this.hitAnimation.textureNumber.push(137);
        this.hitAnimation.textureNumber.push(138);
        this.hitAnimation.textureNumber.push(138);

        this.hitAnimation.timeToChange = 150;

        this.currentAnimation = this.hitAnimation;

        this.idleAnimation.timeToChange = 175;
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        super.update(delta, tiles, player);

        this.currentAnimation.next(delta);

        this.npcAction(delta, player, tiles);
    }

    public getCollisionArea() {
        let collisionArea: Rectangle;

        if (this.currentState != State.Tracking && this.currentState != State.InHitRange) {
            collisionArea = new Rectangle(this.position.x + this.width/2, this.position.y - 5 + this.height, 0, 0);
        } else {
            collisionArea = new Rectangle(this.position.x, this.position.y - 5, this.width, this.height);
        }


        return collisionArea;
    }

    protected hit(delta: number, player: Player, tiles: Tile[]) {
        super.hit(delta, player, tiles);
        if (this.hitAnimation.frameIndex == 2 && !this.hitting) {
            this.hitting = true;
            
            let pos: Vector;
            if(this.inverse) {
                pos = new Vector(this.position.x + 30, this.position.y + 20);
            } else {
                pos = new Vector(this.position.x - 50, this.position.y + 20);
            }

            let projectile = this.projectileHandler.createCollisionProjectile(pos, this.width, this.inverse, 60, new Vector(1, 0.8));
        }

        if (this.hitAnimation.frameIndex == 0) {
            this.hitting = false;
        }
    }

    protected idle(delta: number, player: Player, tiles: Tile[]) {
        super.idle(delta, player, tiles);
        this.stop();
        this.burnValue = 0;
    }

    protected idleToTrackingTransition(delta: number) {
        this.currentAnimation = this.idleToTrackingAnimation;
        this.stop();

        if (this.idleToTrackingAnimation.repetitions == 0) {
            this.trackingTime = this.trackingMaxTime;
            this.currentState = State.Tracking;
            this.currentAnimation = this.trackingAnimation;
            this.maxSpeed = this.trackingSpeed;
            this.actualSpeed = this.maxSpeed;
            this.idleToTrackingAnimation.reset();
            this.idleToTrackingAnimation.repetitions = 13;
        }
    }

    protected trackingToInRangeTransition(delta: number) {
        this.currentState = State.InHitRange;
    }

    protected trackingToIdleTransition(delta: number) {
        this.currentAnimation = this.trackingToIdleTransitionAnimation;
        this.stop();

        if (this.trackingToIdleTransitionAnimation.repetitions == 0) {
            this.currentState = State.Idle;
            this.currentAnimation = this.idleAnimation;
            this.maxSpeed = this.idleSpeed;
            this.actualSpeed = this.maxSpeed;
            this.trackingToIdleTransitionAnimation.reset();
            this.trackingToIdleTransitionAnimation.repetitions = 4;
        }
    }

    protected inRange(player: Player, offset: number, tiles: Tile[]) {

        let deltaPos = this.getDeltaPosition(player);
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

    private clearShoot(deltaPos: Vector, tiles: Tile[]) {
        let clear = true;
        let pathBlocks = this.getPathBlocks(deltaPos);

        for (let block of pathBlocks) {
            if (!this.collisionDetection.fastCheckEnviroment(block, tiles)) {
                clear = false;
                break;
            }
        }

        return clear;
    }

    private getPathBlocks(deltaPos: Vector) {

        let blocksize = 20;
        let magnitude = deltaPos.magnitude();
        let direction = deltaPos.copy(deltaPos);
        let bowPosition = new Vector(this.position.x, this.position.y + 10);

        direction.normalize();

        let blocks: Rectangle[] = [];

        for (let i = 0; i < Math.floor(magnitude / blocksize); i++) {

            let newMagnitude = magnitude - (i * blocksize);

            blocks.push(new Rectangle(bowPosition.x + direction.x * newMagnitude, bowPosition.y + direction.y * newMagnitude, blocksize, 17));
        }

        return blocks;
    }
}