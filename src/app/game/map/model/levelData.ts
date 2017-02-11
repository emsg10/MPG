import { Tile, Vector } from '../../model'
import { EnemyData } from './';

export class LevelData {
	
	public tiles: Tile[];
	public enemies: EnemyData[];
	public playerPosition: Vector;

	constructor() {
	}
}