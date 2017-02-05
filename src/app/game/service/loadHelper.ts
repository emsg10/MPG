import { Level } from '../model';
import { Enemy } from '../character/enemy';
import { Swordman } from '../character/swordman';

export class LoadHelper {

	private static instance: LoadHelper = new LoadHelper();

	constrcuctor() {
		if (LoadHelper.instance) {
			throw new Error("Static class cant be instanced!");
		}

		LoadHelper.instance = this;
	}

	public static getInstance() {
		return LoadHelper.instance;
	}

	public checkLevelType(arg: Level) {
		return (arg.tiles != undefined && arg.playerPosition != undefined);
	}

	public loadJsonLevel(data: any) {
		let level = new Level();
		level.playerPosition = data.playerPosition;
		level.tiles = data.tiles;
		let enemies: Enemy[] = [];
		for (let enemy of data.enemies) {
			enemies.push(new Swordman(enemy.position, enemy.width, enemy.height));
		}
		level.enemies = enemies;

		return level;
	}

}