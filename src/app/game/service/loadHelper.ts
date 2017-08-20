import { LevelData } from '../map/model';
import { Level, Tile, DynamicTile, Rectangle, Vector } from '../model';
import { Enemy, Swordman, Archer, Shadow, Apprentice, Screamer, MasterSorcerer, IEnemy } from '../character';
import { ProjectileHandler } from '../handler/projectileHandler';
import { AnimationHandler } from '../handler/animationHandler';
import { ParticleHandler } from '../handler/particleHandler';
import { ShapeShifter } from "../character/shapeshifter";

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

	public levelDataToLevel(levelData: LevelData, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler, particleHandler: ParticleHandler) {

		let level = new Level();

		level.name = levelData.name;
		level.end = new Rectangle(levelData.end[0], levelData.end[1], 256, 128);
		level.player = [levelData.player[0], levelData.player[1]];
		level.gameSize = [levelData.gameSize[0], levelData.gameSize[1]];
		level.camera = [levelData.camera[0], levelData.camera[1]];


		level.tiles = levelData.tiles.map(it => { return new Tile(it.area.x, it.area.y, it.area.width, it.area.height, it.key) });
		level.decorativeTiles = levelData.decorativeTiles.map(it => { return new Tile(it.area.x, it.area.y, it.area.width, it.area.height, it.key) });
	
		if(levelData.background) {
			let background = levelData.background;
			level.decorativeTiles.unshift(new Tile(background.area.x, background.area.y, background.area.width, background.area.height, background.key));
		}

		level.dynamicTiles =  levelData.dynamicTiles.map(it => {

			let velocity: Vector;
			if (it.vertical) {
				if (it.inverse) {
					velocity = new Vector(0, -it.velocity);
				} else {
					velocity = new Vector(0, it.velocity);
				}
			} else {
				if (it.inverse) {
					velocity = new Vector(-it.velocity, 0);
				} else {
					velocity = new Vector(it.velocity, 0);
				}
			}

			return new DynamicTile(new Tile(it.tile.x, it.tile.y, it.tile.width, it.tile.height, it.key), velocity, it.vertical, it.distance)
		});

		level.dynamicTiles.sort((a: DynamicTile, b: DynamicTile) => {
			return a.tile.key - b.tile.key;
		});

		level.enemies = levelData.enemies.map(it => {
			let enemy: IEnemy;
			
			if(it.key == 50) {
				enemy = new Swordman(new Vector(it.area.x, it.area.y), it.area.width, it.area.height, projectileHandler, animationHandler);
			} else if(it.key == 51) {
				enemy = new Archer(new Vector(it.area.x, it.area.y), it.area.width, it.area.height, projectileHandler, animationHandler);
			} else if(it.key == 52) {
				enemy = new Shadow(new Vector(it.area.x, it.area.y), 85, 85, projectileHandler, animationHandler);
			} else if (it.key == 53) {
				enemy = new MasterSorcerer(new Vector(it.area.x, it.area.y), 128, 96, projectileHandler, animationHandler, particleHandler);
			} else if(it.key == 54) { 
				enemy = new Apprentice(new Vector(it.area.x, it.area.y), it.area.width, it.area.height, projectileHandler, animationHandler, particleHandler);
			} else if(it.key == 55){
				enemy = new Screamer(new Vector(it.area.x, it.area.y), 64, 96, projectileHandler, animationHandler, particleHandler);
			} else if(it.key == 56){
				enemy = new ShapeShifter(new Vector(it.area.x, it.area.y), 128, 128, projectileHandler, animationHandler, particleHandler);
			} 

			return enemy;
		});

		return level;

	}

	public validateLevelData(levelData: LevelData) {

		let valid = (this.checkDoubleNumberTouple(levelData, "camera")
			&& this.checkPropertyExists(levelData, "dynamicTiles")
			&& this.checkPropertyExists(levelData, "enemies")
			&& this.checkPropertyExists(levelData, "tiles")
			&& this.checkPropertyExists(levelData, "decorativeTiles")
			&& this.checkPropertyExists(levelData, "background")
			&& this.checkDoubleNumberTouple(levelData, "player")
			&& this.checkDoubleNumberTouple(levelData, "gameSize")
			&& this.checkDoubleNumberTouple(levelData, "end"));
		return valid;
	}

	private checkDoubleNumberTouple(levelData: LevelData, property: string) {
		let value = (this.checkPropertyExists(levelData, property) && levelData[property].length == 2 && this.isNumber(levelData[property][0]) && this.isNumber(levelData[property][1]));
		return value;
	}

	private isNumber(number: string) {
		return (!isNaN(+number));
	}

	private checkPropertyExists(levelData: LevelData, property: string) {
		let value = (levelData[property] !== undefined)
		return value;
	}

}