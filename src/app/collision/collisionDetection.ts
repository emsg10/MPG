import { Vector, Tile, Rectangle } from '../../model';
import { CollisionData } from './';
import { Player } from '../player/player';
import { TileMap } from '../tileMap';

export class CollisionDetection {

	private static instance: CollisionDetection = new CollisionDetection();

	constructor() {
		if(CollisionDetection.instance) {
			throw new Error("Static class cant be instanced!");
		}

		CollisionDetection.instance = this;
	}

	public static getInstance() {
		return CollisionDetection.instance;
	}

	public detectPossibleCollisions(position: Vector, tiles: Tile[][], tileSize: number) {
		var column = Math.floor(position.x/tileSize);
		var row = Math.floor(position.y/tileSize);

		var tilesToCheck: Tile[] = [];

		for(let i = -2; i < 2; i++) {
			for(let j = -2; j < 2; j++) {
				this.pushNull(tiles[column + i][row + j], tilesToCheck);
			}
		}

		return tilesToCheck;
	}

	private pushNull(tile: Tile, tilesToCheck: Tile[]) {
		if(tile != null) {
			tilesToCheck.push(tile);
		}
	}

	public checkCollision(tiles: Tile[][], player: Player, tileSize: number) {

		var tilesToCheck = this.detectPossibleCollisions(player.position, tiles, tileSize);
		let collisionData: CollisionData = new CollisionData();

		for(let tile of tilesToCheck) {
			if(tile.tileTextureType != 0) {
				collisionData = this.aabbCollision(player.getCollisionArea(), tile, player.velocity, collisionData)
			}
		}

		collisionData.remainingTime = 1 - collisionData.collisionTime;

		return collisionData;
	}

	private aabbCollision(rect1: Rectangle, rect2: Rectangle, velocity: Vector, collisionData: CollisionData) {
		var xInvEntry: number;
		var xInvExit: number;
		var yInvEntry: number;
		var yInvExit: number;

		if(velocity.x > 0) {
			xInvEntry = rect2.x - (rect1.x + rect1.width);
			xInvExit = (rect2.x + rect2.width) - rect1.x;
		} else {
			xInvEntry = (rect2.x + rect2.width) - rect1.x;
			xInvExit = rect2.x - (rect1.x + rect1.width);
		}

		if(velocity.y > 0) {
			yInvEntry = rect2.y - (rect1.y + rect1.height);
			yInvExit = (rect2.y + rect2.height) - rect1.y;
		} else {
			yInvEntry = (rect2.y + rect2.height) - rect1.y;
			yInvExit = rect2.y - (rect1.y + rect1.height);
		}

		var xEntry: number;
		var xExit: number;
		var yEntry: number;
		var yExit: number;

		if(velocity.x == 0) {
			xEntry = -Number.MAX_SAFE_INTEGER;
			xExit = Number.MAX_SAFE_INTEGER;
		} else {
			xEntry = xInvEntry / velocity.x;
			xExit = xInvExit / velocity.x;
		}

		if(velocity.y == 0) {
			yEntry = -Number.MAX_SAFE_INTEGER;
			yExit = Number.MAX_SAFE_INTEGER;
		} else {
			yEntry = yInvEntry / velocity.y;
			yExit = yInvExit / velocity.y;
		}

		collisionData.collisionTime = xEntry < yEntry ? yEntry : xEntry;
		var exitTime = xExit < yExit ? xExit : yExit;

		if (collisionData.collisionTime > exitTime || xEntry < 0 && yEntry < 0 || xEntry > 1 || yEntry > 1) {
			collisionData.collisionTime = 1;
        	return collisionData;
    	} else {
    		console.log(collisionData.collisionTime);
    		if (xEntry > yEntry) {
            	if (xInvEntry < 0) {
                	collisionData.normalX = 1;
                	collisionData.normalY = 0;
            	}
	        	else {
                	collisionData.normalX = -1;
                	collisionData.normalY = 0;
            	}
            	collisionData.wallCollision = true;
        	}
        	else {
            	if (yInvEntry < 0) {
                	collisionData.normalX = 0;
                	collisionData.normalY = 1;
            	}
	        	else {
                	collisionData.normalX = 0;
		        	collisionData.normalY = -1;
            	}
            	collisionData.groundCollision = true;
            	
        	}
		}
        return collisionData;
    }



	public checkPowerUps(player: Player, tilemap: TileMap, tileSize: number) {
		var column = Math.floor(player.position.x/tileSize);
		var row = Math.floor(player.position.y/tileSize);

		var tile = tilemap.tiles[column][row + 1];
		if(tile != null) {
			if(tile.tileTextureType == 15) {
			player.jumpSpeed = (player.defaultJumpSpeed * 1.5);
			} else {
				player.jumpSpeed = (player.defaultJumpSpeed);
			}	
		}
		
	}
}