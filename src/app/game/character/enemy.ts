import { Vector, Tile, Rectangle, Animation, SpellType } from '../model'
import { Character } from './character';
import { Player } from './player';
import { CollisionDetection } from '../collision/collisionDetection';
import { CollisionData } from '../collision/collisionData';
import { AnimationHandler } from '../handler/animationHandler';
import { DeathType } from './deathType';

export class Enemy extends Character {

    public color = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    protected direction = true;
    protected oldDirection = true;
    protected collisionDetection = CollisionDetection.getInstance();
    protected nextToEdge: boolean;
    protected runningAnimation = new Animation();
    protected collisionData: CollisionData;
    protected hp: number = 100;
    protected freezeDamage: number = 0.04;
    protected maxFreeze = this.hp/this.freezeDamage;
    protected freezeValue = 0;

    constructor(position: Vector, width: number, height: number) {
        super(position, width, height);
    }

    public takeDamage(damage: number, type: SpellType) {
        this.hp = this.hp - damage;
        if(this.hp <= 0) {
            if(type == SpellType.frostBlast) {
                this.deathType = DeathType.freezeDeath;
            } else {
                this.deathType = DeathType.swordDeath;
            }
            
            this.dead = true;
        }
    }

    public freeze() {
        if(this.actualSpeed > this.maxSpeed * 0.3) {
            this.actualSpeed = this.actualSpeed * 0.997;
        }

        this.takeDamage(this.freezeDamage, SpellType.frostBlast);
        this.freezeValue++;
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        this.toMove.x = this.velocity.x * delta;
        this.toMove.y = this.velocity.y * delta;
        this.nextToEdge = false;

        if(this.actualSpeed < this.maxSpeed) {
            this.actualSpeed = this.actualSpeed * 1.005;
        }

        this.collisionData = this.collisionDetection.collisionDetection(tiles, this);

        this.fall(delta);

        let leftEdge = this.collisionDetection.checkEdge(new Rectangle(this.position.x, this.position.y + this.height, 1, 30), tiles);
        let rightEdge = this.collisionDetection.checkEdge(new Rectangle(this.position.x + this.width, this.position.y + this.height, 1, 30), tiles);

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

        let freezePercent = this.freezeValue/this.maxFreeze;
        this.updateColor([1.0 + (freezePercent * 1.0), 1.0 + (freezePercent * 2.0), 1.0 + (freezePercent * 2.0), 1.0]);
    }

    public getCollisionArea() {
        let collisionArea = new Rectangle(this.position.x, this.position.y, this.width, 55);

        return collisionArea;
    }

    private updateColor(color: number[]) {
        let colorColl: number[] = [];

        for(let i = 0; i < 6; i++) {
            colorColl.push(...color);
        }

        this.color = colorColl;
    }

}