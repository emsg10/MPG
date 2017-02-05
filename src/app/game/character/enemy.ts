import { Vector, Tile, Rectangle } from '../model'
import { Character } from './character';
import { CollisionDetection } from '../collision/collisionDetection';

export class Enemy extends Character{

    private collisionDetection = CollisionDetection.getInstance();

    constructor(position: Vector, width: number, height: number) {
        super(position, width, height);
    }

    public update(delta: number, tiles: Tile[]) {
        this.toMove.x = this.velocity.x * delta;
        this.toMove.y = this.velocity.y * delta;

        let collisionData = this.collisionDetection.checkCollision(tiles, this, this.toMove);

        this.fall(delta);

        if (collisionData.groundCollision) {
			this.velocity.y = 0;
		}

		if (collisionData.wallCollision) {
			this.velocity.x = 0;
		}

    }

    public getCollisionArea() {
		var collisionArea = new Rectangle(this.position.x, this.position.y, this.width, 55);

		return collisionArea;
	}

}