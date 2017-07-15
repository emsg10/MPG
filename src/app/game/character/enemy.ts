import { Vector, Tile, Rectangle, Animation, SpellType } from '../model'
import { Character } from './character';
import { Player } from './player';
import { State } from './';
import { CollisionDetection } from '../collision/collisionDetection';
import { CollisionData } from '../collision/collisionData';
import { AnimationHandler } from '../handler/animationHandler';
import { DeathType } from './deathType';

export class Enemy extends Character {

    public color = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    public burnValue = 0;
    protected direction = true;
    protected oldDirection = true;
    protected collisionDetection = CollisionDetection.getInstance();
    protected nextToEdge: boolean;
    protected idleAnimation: Animation;
    protected idleToTrackingAnimation: Animation;
    protected trackingAnimation: Animation;
    protected trackingToInRangeTransitionAnimation: Animation;
    protected trackingToIdleTransitionAnimation: Animation;
    protected hitAnimation: Animation;
    protected collisionData: CollisionData;
    protected hitDamage = 0;
    protected hp: number = 100;
    protected freezeDamage: number = 0.08;
    protected flameDamage: number = 0.12;
    protected maxFreeze = this.hp / this.freezeDamage;
    protected freezeValue = 0;
    protected burnDamage = 0.2;
    protected cinderValue = 0;
    protected burnDurationFactor = 3;
    protected hitAreaOffset = 40;
    protected minDistance = 5;
    protected searchAreaOffset = 150;
    protected trackingTime = 0;
    protected trackingMaxTime = 3000;
    protected trackingSpeed = 0;
    protected idleSpeed = 0;
    protected hitting = false;
    protected collisionArea: Rectangle;

    protected currentState = State.Idle;

    constructor(position: Vector, width: number, height: number) {
        super(position, width, height);
    }

    public takeDamage(damage: number, type: SpellType) {
        this.hp = this.hp - damage;
        if (this.hp <= 0) {
            if (type == SpellType.frostBlast) {
                this.deathType = DeathType.freezeDeath;
            } else if (type == SpellType.fireBlast) {
                this.deathType = DeathType.fireDeath;
            } else {
                this.deathType = DeathType.swordDeath;
            }

            this.dead = true;
        }
    }

    public burn() {

        this.cinderValue += this.burnDurationFactor;
        this.takeDamage(this.flameDamage, SpellType.fireBlast);

        if (this.cinderValue > 300) {
            this.burnValue += this.burnDurationFactor;
        }
    }

    public freeze() {
        if (this.actualSpeed > this.maxSpeed * 0.3) {
            this.actualSpeed = this.actualSpeed * 0.997;
        }

        this.takeDamage(this.freezeDamage, SpellType.frostBlast);
        this.freezeValue++;
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        this.toMove.x = this.velocity.x * delta;
        this.toMove.y = this.velocity.y * delta;
        this.nextToEdge = false;

        if (this.actualSpeed < this.maxSpeed) {
            this.actualSpeed = this.actualSpeed * 1.005;
        }

        this.collisionData = this.collisionDetection.collisionDetection(tiles, [], this, this.toMove, delta);

        this.fall(delta);

        let collisionArea = this.getCollisionArea();

        let leftEdge = this.collisionDetection.fastCheckEnviroment(new Rectangle(collisionArea.x, collisionArea.y + collisionArea.height, 1, 30), tiles);
        let rightEdge = this.collisionDetection.fastCheckEnviroment(new Rectangle(collisionArea.x + collisionArea.width, collisionArea.y + collisionArea.height, 1, 30), tiles);

        if (leftEdge && rightEdge) {
            this.nextToEdge = true;
        } else {
            if (this.inverse) {
                if (leftEdge) {
                    this.direction = false;
                    this.nextToEdge = true;
                }
            } else {
                if (rightEdge) {
                    this.direction = true;
                    this.nextToEdge = true;
                }
            }
        }

        if (this.collisionData.groundCollision) {
            this.velocity.y = 0;
        }

        if (this.collisionData.wallCollision) {
            if (this.collisionData.normalX == 1) {
                this.nextToEdge = true;
                this.direction = !this.direction;
            } else {
                this.nextToEdge = true;
                this.direction = !this.direction;
            }
            this.velocity.x = 0;
        }

        let freezePercent = this.freezeValue / this.maxFreeze;
        this.updateColor([1.0 + (freezePercent * 1.0), 1.0 + (freezePercent * 2.0), 1.0 + (freezePercent * 2.0), 1.0]);

        this.updateBurnDamage();
    }

    public getCollisionArea() {
        let collisionArea = new Rectangle(0, 0, 0, 0);
        return collisionArea;
    }

    protected idle(delta: number, player: Player, tiles: Tile[]) {
        this.currentAnimation = this.idleAnimation;
        this.maxSpeed = this.idleSpeed;
        if (this.inRange(player, this.searchAreaOffset, tiles)) {
            this.currentState = State.IdleToTrackingTransition;
        }
    }

    protected idleToTrackingTransition(delta: number) {

    }

    protected trackingToInRangeTransition(delta: number) {

    }

    protected trackingToIdleTransition(delta: number) {

    }

    protected patrol(delta: number) {
        if (this.oldDirection != this.direction) {
            this.oldDirection = this.direction;
        }

        if (this.oldDirection) {
            this.moveLeft(delta);
        } else {
            this.moveRight(delta);
        }
    }

    protected hit(delta: number, player: Player, tiles: Tile[]) {
        this.currentAnimation = this.hitAnimation;
        if (!this.inRange(player, this.hitAreaOffset, tiles) && this.hitAnimation.frameIndex == 0) {
            this.currentState = State.Tracking;
        }

        this.moveToPlayer(delta, player, tiles, 10);
    }

    protected npcAction(delta: number, player: Player, tiles: Tile[]) {

        switch (this.currentState) {
            case State.Idle: this.idle(delta, player, tiles);
                break;

            case State.IdleToTrackingTransition: this.idleToTrackingTransition(delta);
                break;

            case State.TrackingToIdleTransition: this.trackingToIdleTransition(delta);
                break;

            case State.Tracking: this.track(player, delta, tiles, 10);
                break;

            case State.TrackingToInRangeTransition: this.trackingToInRangeTransition(delta);
                break;

            case State.InHitRange: this.hit(delta, player, tiles);
                break;
        }
    }

    protected checkStop(player: Player, tiles: Tile[]) {
        if (this.nextToEdge || this.inRange(player, this.minDistance, tiles)) {
            this.stop();
        }
    }

    protected stop() {
        this.velocity.x = 0;
    }

    protected track(player: Player, delta: number, tiles: Tile[], gapSize: number) {
        this.currentAnimation = this.trackingAnimation;
        this.maxSpeed = this.trackingSpeed;

        this.trackingTime -= delta;
        if (this.trackingTime <= 0) {
            this.currentState = State.TrackingToIdleTransition;
        }

        if (this.inRange(player, this.searchAreaOffset, tiles)) {
            this.trackingTime = this.trackingMaxTime;
        }

        if (this.inRange(player, this.hitAreaOffset, tiles)) {
            this.currentState = State.TrackingToInRangeTransition;
        }

        this.moveToPlayer(delta, player, tiles, gapSize);
    }

    protected moveToPlayer(delta: number, player: Player, tiles: Tile[], gapSize: number) {
        if (Math.abs(player.position.x - this.position.x) > gapSize) {
            if (player.position.x < this.position.x) {
                this.moveLeft(delta);

                this.checkStop(player, tiles);
            } else if (player.position.x > this.position.x) {
                this.moveRight(delta);

                this.checkStop(player, tiles);
            }
        }
    }

    protected inRange(player: Player, offset: number, tiles: Tile[]) {

    }

    protected rand(min: number, max: number) {
        return min + (Math.random() * (max - min))
    }

    protected getDeltaPosition(player: Player, offset: number) {
        return new Vector(player.middlePosition.x - offset - this.position.x, player.middlePosition.y - this.position.y);
    }

    private updateBurnDamage() {
        if (this.burnValue > 0) {
            this.takeDamage(this.burnDamage, SpellType.fireBlast);
            this.burnValue--;
        }
    }

    private updateColor(color: number[]) {
        let colorColl: number[] = [];

        for (let i = 0; i < 6; i++) {
            colorColl.push(...color);
        }

        this.color = colorColl;
    }

}