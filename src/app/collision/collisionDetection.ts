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

	public checkGroundCollision(tiles: Tile[], rect: Rectangle) {
		var collision = false;
			for(let tile of tiles) {
				if(tile.tileTextureType != 0) {
					if (tile.x - tile.width/2 < rect.x + rect.width/2 &&
	   				tile.x + tile.width/2 > rect.x - rect.width/2 &&
	   				tile.y - tile.height/2 < rect.y + rect.height/2 &&
	   				tile.y + tile.height/2 > rect.y - tile.height/2) {
	   					
						collision = true;
						break;
					}
				}
			}

		return collision;
	}

	public checkWallCollision(tiles: Tile[], rect: Rectangle) {
		var collision = false;
			for(let tile of tiles) {
				if(tile.tileTextureType != 0) {
					if (tile.x - tile.width/2 < rect.x + rect.width/2 &&
	   				tile.x + tile.width/2 > rect.x - rect.width/2 &&
	   				tile.y - tile.height/2 < rect.y + rect.height/2 &&
	   				tile.y + tile.height/2 > rect.y - tile.height/2) {
	   					collision = true;
	   					break;
					}
				}
			}

		return collision;
	}

}