import { Tile, Vector } from './'
import { Enemy } from '../character/enemy';
import { Swordman } from '../character/swordman';

export class Level {
	
	public tiles: Tile[];
	public enemies: Enemy[];
	public playerPosition: Vector;

	constructor() {
	}

	public copy() {
		let level = new Level();

		level.playerPosition = new Vector(this.playerPosition.x, this.playerPosition.y);
		level.tiles = Object.assign(this.tiles, {});
		level.enemies = [];
		for(let enemy of this.enemies) {
			level.enemies.push(new Swordman(enemy.position, enemy.width, enemy.height))
		}

		return level;
	}
}