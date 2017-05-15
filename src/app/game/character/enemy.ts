import { Vector, Tile, Rectangle, Animation, SpellType } from '../model'
import { Character } from './character';
import { Player } from './player';
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
    protected runningAnimation = new Animation();
    protected hitAnimation = new Animation();
    protected trackingAnimation = new Animation();
    protected collisionData: CollisionData;
    protected hp: number = 100;
    protected freezeDamage: number = 0.08;
    protected flameDamage: number = 0.12;
    protected maxFreeze = this.hp / this.freezeDamage;
    protected freezeValue = 0;
    protected burnDamage = 0.2;
    protected cinderValue = 0;
    protected burnDurationFactor = 3;
    protected tracking = false;
    protected hitAreaOffset = 40;
    protected searchAreaOffset = 150;
    protected trackingTime = 0;
    protected trackingMaxTime = 3000;

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

        let leftEdge = this.collisionDetection.fastCheckEnviroment(new Rectangle(this.position.x, this.position.y + this.height, 1, 30), tiles);
        let rightEdge = this.collisionDetection.fastCheckEnviroment(new Rectangle(this.position.x + this.width, this.position.y + this.height, 1, 30), tiles);

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

        this.trackingTime -= delta;
        if (this.trackingTime <= 0) {
            this.tracking = false;
            this.currentAnimation = this.runningAnimation;
        }

        let freezePercent = this.freezeValue / this.maxFreeze;
        this.updateColor([1.0 + (freezePercent * 1.0), 1.0 + (freezePercent * 2.0), 1.0 + (freezePercent * 2.0), 1.0]);

        this.updateBurnDamage();
    }

    public getCollisionArea() {
        let collisionArea = new Rectangle(this.position.x, this.position.y, this.width, 55);

        return collisionArea;
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

    protected hit(player: Player) {

    }

    protected npcAction(delta: number, player: Player, tiles: Tile[]) {

        if (this.tracking) {
            if (this.inRange(player, this.hitAreaOffset, tiles)) {
                this.trackingTime = this.trackingMaxTime;
                this.hit(player);
                this.currentAnimation = this.hitAnimation;
            } else {
                this.currentAnimation = this.trackingAnimation;
            }

            this.track(player, delta, tiles);

        } else {
            if (this.inRange(player, this.searchAreaOffset, tiles)) {
                this.trackingTime = this.trackingMaxTime;
                this.startTracking();
            } else {
                this.patrol(delta);
            }
        }
    }

    protected checkStop(player: Player, tiles: Tile[]) {
        if (this.nextToEdge || this.inRange(player, 5, tiles)) {
            this.stop();
        }
    }

    protected startTracking() {
        this.trackingTime = this.trackingMaxTime;
        this.tracking = true;
        this.currentAnimation = this.trackingAnimation;
        this.maxSpeed = 0.2;
        this.actualSpeed = this.maxSpeed;
    }

    protected stop() {
        this.velocity.x = 0;
    }

    protected track(player: Player, delta: number, tiles: Tile[]) {

        if (Math.abs(player.position.x - this.position.x) > 10) {
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