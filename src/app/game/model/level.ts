import { Tile, Vector, Rectangle, DynamicTile } from './'
import { Enemy } from '../character/enemy';

export class Level {
    public tiles: Tile[] = [];
	public dynamicTiles: DynamicTile[] = [];
	public enemies: Enemy[] = [];
	public player: [number, number];
	public gameSize: [number, number];
	public camera: [number, number];
	public end: Rectangle;
}