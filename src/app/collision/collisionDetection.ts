import { Vector, Tile, Rectangle } from '../../model';
import { Collision } from './';

export class CollisionDetection {

	constructor() {
	}

	public detectPossibleCollisions(position: Vector, tiles: Tile[][], tileSize: number) {
		var column = Math.floor(position.x/tileSize);
		var row = Math.floor(position.y/tileSize);

		var tilesToCheck: Tile[] = [];
		tilesToCheck.push(tiles[column-1][row + 1]);
		tilesToCheck.push(tiles[column][row + 1]);
		tilesToCheck.push(tiles[column+1][row + 1]);
		tilesToCheck.push(tiles[column-1][row]);
		tilesToCheck.push(tiles[column][row]);
		tilesToCheck.push(tiles[column+1][row]);
		tilesToCheck.push(tiles[column-1][row - 1]);
		tilesToCheck.push(tiles[column][row - 1]);
		tilesToCheck.push(tiles[column+1][row - 1]);

		return tilesToCheck;
	}

	public checkCollisions(tiles: Tile[], collisionbox: Rectangle) {
		var collision: Collision = new Collision();
		for(let tile of tiles) {
			if(tile.tileTextureType != 0) {
				if (tile.x < collisionbox.x + collisionbox.width &&
   				tile.x + tile.width > collisionbox.x) {
   					collision.wallCollision = true;
				}
				if(tile.y < collisionbox.y + collisionbox.height &&
   				tile.height + tile.y > collisionbox.y) {
					collision.groundCollision = true;
   				}	
			}
		}

		return collision;
	}

}