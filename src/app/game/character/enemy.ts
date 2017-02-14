import { Vector, Tile, Rectangle, Animation } from '../model'
import { Character } from './character';
import { Player } from './player';
import { CollisionDetection } from '../collision/collisionDetection';
import { CollisionData } from '../collision/collisionData';
import { AnimationHandler } from '../handler/animationHandler';

export class Enemy extends Character {

    protected direction = false;
    protected oldDirection = false;
    protected collisionDetection = CollisionDetection.getInstance();
    protected nextToEdge: boolean;
    protected runningAnimation = new Animation();
    protected collisionData: CollisionData;

    constructor(position: Vector, width: number, height: number) {
        super(position, width, height);
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        this.toMove.x = this.velocity.x * delta;
        this.toMove.y = this.velocity.y * delta;
        this.nextToEdge = false;

        this.collisionData = this.collisionDetection.collisionDetection(tiles, this);

        this.fall(delta);

        let leftEdge = this.collisionDetection.checkEdge(new Rectangle(this.position.x, this.position.y + this.height + 5, 1, 1), tiles);
        let rightEdge = this.collisionDetection.checkEdge(new Rectangle(this.position.x + this.width, this.position.y + this.height + 5, 1, 1), tiles);

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
                this.direction = true;
            } else {
                this.direction = false;
            }
            this.velocity.x = 0;
        }
    }

    public getCollisionArea() {
        let collisionArea = new Rectangle(this.position.x, this.position.y, this.width, 55);

        return collisionArea;
    }

}