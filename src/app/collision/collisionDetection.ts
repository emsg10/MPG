import { Vector, Tile, Rectangle } from '../../model';
import { Collision } from './';
import { Player } from '../player/player';
import { TileMap } from '../tileMap';

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

	public checkCollision(tiles: Tile[], rect: Rectangle) {
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

	public checkIfWallCollision(player: Player, tileMap: TileMap, tileSize: number) {

		var wallCollision = true;
		var i = 0;
		while(wallCollision && i < 10) {
			i++;
			var tilesToCheck = this.detectPossibleCollisions(player.position, tileMap.tiles, tileSize);
			wallCollision = this.checkCollision(tilesToCheck, player.getNextCollisionArea(true));
			if(wallCollision) {
				player.wallCollision();
			}
		}
		

		return wallCollision;
	}

	public checkPowerUps(player: Player, tilemap: TileMap, tileSize: number) {
		var column = Math.floor(player.position.x/tileSize);
		var row = Math.floor(player.position.y/tileSize);

		var tile = tilemap.tiles[column][row + 1];

		if(tile.tileTextureType == 15) {
			player.jumpSpeed = (player.defaultJumpSpeed * 1.5);
		} else {
			player.jumpSpeed = (player.defaultJumpSpeed);
		}
	}
}