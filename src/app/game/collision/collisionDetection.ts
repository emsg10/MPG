import { Vector, Tile, Rectangle, Projectile } from '../model';
import { CollisionData, Grid } from './';
import { Character } from '../character/character';
import { Enemy } from '../character/enemy';

export class CollisionDetection {

	private static instance: CollisionDetection = new CollisionDetection();
	private grid: Grid;
	private gameSize: Vector;
	private gridItemSize: number;
	

	constructor() {
		if(CollisionDetection.instance) {
			throw new Error("Static class cant be instanced!");
		}

		CollisionDetection.instance = this;
	}

	public static getInstance() {
		return CollisionDetection.instance;
	}

	public createGrid(gameSize: Vector, collidables: Rectangle[]) {
		this.gameSize = gameSize;
		this.grid = new Grid(25, this.gameSize);

		for(let collidable of collidables) {
			this.grid.insert(collidable);
		}
	}

	public collisionDetection(tiles: Tile[], character: Character) {

		let collisionData = this.checkCollision(tiles, character, character.toMove);

		if(collisionData.wallCollision) {
			let position = new Vector(character.position.x, character.position.y);
			collisionData.wallCollision = false;
			collisionData = this.checkCollision(tiles, character, new Vector((character.toMove.x * (1 - collisionData.collisionTimeX)) ,-5));
			if(collisionData.wallCollision) {
				character.position = position;
			}
		}

		return collisionData;
	}

	public checkEdge(rect: Rectangle, tiles: Tile[]) {
		let edge = true;

		let possibleColls = this.grid.get(rect);

		for(let tile of possibleColls) {
			if(this.aabbCheck(rect, tile)) {
				edge = false;
			}
		}

		return edge;
	}

	public checkProjectileCollisionX(collidables: Rectangle[], projectile: Projectile, frameVelocity: Vector) {

		let broadphasebox = this.getSweptBroadphaseBoxX(projectile.collisionArea, frameVelocity);

		let collisionData: CollisionData = new CollisionData();

		for(let collidable of collidables) {
			if(this.aabbCheck(broadphasebox, collidable)) {
				collisionData = this.aabbCollisionX(projectile.collisionArea, collidable, frameVelocity, collisionData);
			}
		}

		return collisionData;
	}

	public checkProjectileCollisionY(collidables: Rectangle[], projectile: Projectile, frameVelocity: Vector) {
		let broadphasebox = this.getSweptBroadphaseBoxY(projectile.collisionArea, frameVelocity);

		let collisionData: CollisionData = new CollisionData();

		for(let collidable of collidables) {
			if(this.aabbCheck(broadphasebox, collidable)) {
				collisionData = this.aabbCollisionY(projectile.collisionArea, collidable, frameVelocity, collisionData);
			}
		}

		return collisionData;
	}

	public checkCollision(tiles: Tile[], character: Character, frameVelocity: Vector) {

		let tilesToCheck = tiles;
		let collisionData: CollisionData = new CollisionData();
		let rect1 = character.getCollisionArea();
		let broadphasebox = this.getSweptBroadphaseBoxY(rect1, frameVelocity);

		let possibleColls = this.grid.get(broadphasebox) as Tile[];

		for(let tile of possibleColls) {
			if(this.aabbCheck(broadphasebox, tile)) {
				collisionData = this.aabbCollisionY(character.getCollisionArea(), tile, frameVelocity, collisionData, tile.tileTextureType);
			}
		}

		character.position.y += frameVelocity.y * collisionData.collisionTimeY;

		rect1 = character.getCollisionArea();
		broadphasebox = this.getSweptBroadphaseBoxX(rect1, frameVelocity);

		for(let tile of tilesToCheck) {
			if(tile.tileTextureType != 0) {
				if(this.aabbCheck(broadphasebox, tile)) {
					collisionData = this.aabbCollisionX(character.getCollisionArea(), tile, frameVelocity, collisionData);
				}
			}
		}

		character.position.x += frameVelocity.x * collisionData.collisionTimeX;
		
		collisionData.remainingTime = 1 - collisionData.collisionTimeY;

		return collisionData;
	}

	public getClosestX(rect: Rectangle, tiles: Rectangle[], inverse: boolean) {
		let coliidables: Rectangle[] = []
		let closestX: number = inverse ? 0 : 1200;

		let possibleColls = this.grid.get(rect);

		for(let tile of possibleColls) {
			if(this.aabbCheck(rect, tile)) {
				if(inverse) {
					let tileVal = tile.x + tile.width;
					if(tileVal > closestX) {
						closestX = tileVal;
					}
				} else {
					let tileVal = tile.x;
					if(tileVal < closestX) {
						closestX = tileVal;
					}
				}
			}
		}

		return closestX;
	}

	public checkCoutOfBounds(character: Character, area: Vector) {
		let rect = new Rectangle(0, 0, area.x, area.y);
		if(!this.aabbCheck(character.getCollisionArea(), rect)) {
			character.dead = true;
		}
	}

	public aabbCheck(rect1: Rectangle, rect2: Rectangle) {
		return (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y)
	}

	public aabbCheckS(rect1: Rectangle, areas: Rectangle[]) {
		for(let rect2 of areas) {
			if((rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y)) {
				return true;
			}
		}
		
		return false;
	}

	private getSweptBroadphaseBoxX(rect: Rectangle, velocity: Vector)
	{
		let x = rect.x + velocity.x;
    	let y = rect.y;
    	let width = rect.width + Math.abs(velocity.x);
    	let height = rect.height;

    	return new Rectangle(x, y, width, height);
	}

	private getSweptBroadphaseBoxY(rect: Rectangle, velocity: Vector)
	{
    	let x = rect.x;
    	let y = rect.y + velocity.y;
    	let width = rect.width;
    	let height = rect.height + Math.abs(velocity.y);

    	return new Rectangle(x, y, width, height);
	}

	private aabbCollisionY(rect1: Rectangle, rect2: Rectangle, velocity: Vector, collisionData: CollisionData, tileTextureType?: number) {
		let yInvEntry: number;
		let yInvExit: number;

		if(velocity.y > 0) {
			yInvEntry = (rect2.y) - (rect1.y + rect1.height);
			yInvExit = (rect2.y + rect2.height) - (rect1.y);
		} else {
			yInvEntry = (rect2.y + rect2.height) - (rect1.y);
			yInvExit = (rect2.y) - (rect1.y + rect1.height);
		}

		let yEntry: number;
		let yExit: number;

		if(velocity.y == 0) {
			yEntry = -Number.MAX_SAFE_INTEGER;
			yExit = Number.MAX_SAFE_INTEGER;
		} else {
			yEntry = yInvEntry / velocity.y;
			yExit = yInvExit / velocity.y;
		}

		let entryTime = yEntry;
		let exitTime = yExit;

		if (entryTime > exitTime || yEntry < 0 || yEntry > 1) {
        	return collisionData;
    	} else {
    		if (velocity.y < 0) {
                	collisionData.normalY = 1;
            	}
	        	else {
		        	collisionData.normalY = -1;
            	}

            	if(collisionData.collisionTimeY > entryTime) {
            		collisionData.collisionTimeY = entryTime;	
            	}

				if(tileTextureType == 25 && velocity.y > 5) {
					collisionData.fallDeath = true;
				}
            	
				if(velocity.y > 18) {
					collisionData.fallDeath = true;
				}

            	collisionData.groundCollision = true;

		}
        return collisionData;
	}

	private aabbCollisionX(rect1: Rectangle, rect2: Rectangle, velocity: Vector, collisionData: CollisionData) {
		let xInvEntry: number;
		let xInvExit: number;

		if(velocity.x > 0) {
			xInvEntry = (rect2.x) - (rect1.x + rect1.width);
			xInvExit = (rect2.x + rect2.width) - (rect1.x);
		} else {
			xInvEntry = (rect2.x + rect2.width) - (rect1.x);
			xInvExit = (rect2.x) - (rect1.x + rect1.width);
		}

		let xEntry: number;
		let xExit: number;

		if(velocity.x == 0) {
			xEntry = -Number.MAX_SAFE_INTEGER;
			xExit = Number.MAX_SAFE_INTEGER;
		} else {
			xEntry = xInvEntry / velocity.x;
			xExit = xInvExit / velocity.x;
		}

		let entryTime = xEntry;
		let exitTime = xExit;

		if (entryTime > exitTime || xEntry < 0 || xEntry > 1) {
        		return collisionData;
    	} else {
    		if (xInvEntry < 0) {
            	collisionData.normalX = 1;
            } else {
                collisionData.normalX = -1;
            }

            if(collisionData.collisionTimeX > entryTime) {
            	collisionData.collisionTimeX = entryTime;	
            }

            collisionData.wallCollision = true;
    	}

        return collisionData;
    }

}