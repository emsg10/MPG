import { Tile, Vector, Rectangle } from './'
import { Enemy } from '../character/enemy';

export class Level {
    public tiles: Tile[];
	public enemies: Enemy[];
	public playerPosition: Vector;
	public gameSize: Vector;
	public goal: Rectangle;
}