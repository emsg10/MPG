import { Vector, Tile, Rectangle } from '../model'
import { Character } from './character';
import { Player } from './player';
import { CollisionDetection } from '../collision/collisionDetection';
import { AnimationHandler } from '../handler/animationHandler';

export class Enemy extends Character {

    protected direction = false;
    protected oldDirection = false;
    protected collisionDetection = CollisionDetection.getInstance();

    constructor(position: Vector, width: number, height: number) {
        super(position, width, height);
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        this.toMove.x = this.velocity.x * delta;
        this.toMove.y = this.velocity.y * delta;

        let collisionData = this.collisionDetection.collisionDetection(tiles, this);

        this.fall(delta);

        if(this.collisionDetection.checkEdge(new Rectangle(this.position.x, this.position.y + this.height + 5, 1, 1), tiles)) {
            this.direction = false;
        }

        if(this.collisionDetection.checkEdge(new Rectangle(this.position.x + this.width, this.position.y + this.height + 5, 1, 1), tiles)) {
            this.direction = true;
        }

        if (collisionData.groundCollision) {
            this.velocity.y = 0;
        }

        if (collisionData.wallCollision) {
            if(collisionData.normalX == 1) {
                this.direction = true;
            } else {
                this.direction = false;
            }
            this.velocity.x = 0;
        }

        if (this.velocity.x != 0 || collisionData.wallCollision) {
			this.runningAnimation.next(delta);
		}
    }

    public getCollisionArea() {
        let collisionArea = new Rectangle(this.position.x, this.position.y, this.width, 55);

        return collisionArea;
    }

}