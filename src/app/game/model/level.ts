import { Tile, Vector } from './'
import { Enemy } from '../character/enemy';

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
		level.enemies = Object.assign(this.enemies, {});

		return level;
	}
}