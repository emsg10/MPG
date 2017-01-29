import { Tile, Vector } from './'


export class Level {
	
	public tiles: Tile[];
	public playerPosition: Vector;

	constructor() {
	}

	public copy() {
		let level = new Level();

		level.playerPosition = new Vector(this.playerPosition.x, this.playerPosition.x);
		level.tiles = Object.assign(this.tiles, {});

		return level;
	}
}