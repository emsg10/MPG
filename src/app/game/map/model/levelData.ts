import { Tile, Vector, Rectangle } from '../../model'
import { EnemyData } from './';

export class LevelData {
	
	public tiles: Tile[];
	public enemies: EnemyData[];
	public playerPosition: Vector;
	public cameraPosition: Vector;
	public gameSize: Vector;
	public goal: Rectangle;
	constructor() {
	}
}