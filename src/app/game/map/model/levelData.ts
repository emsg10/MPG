import { Tile, Vector, Rectangle, DynamicTileData } from '../../model'
import { EnemyData } from './';

export class LevelData {
	
	public tiles: Tile[];
	public dynamicTiles: DynamicTileData[];
	public enemies: EnemyData[];
	public playerPosition: Vector;
	public cameraPosition: Vector;
	public gameSize: Vector;
	public goal: Rectangle;
	constructor() {
	}
}