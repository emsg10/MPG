import { Tile, Vector, Rectangle, DynamicTile } from './'
import { Enemy } from '../character/enemy';
import { IEnemy } from "../character/index";

export class Level {
	public name: string;
    public tiles: Tile[] = [];
	public decorativeTiles: Tile[] = [];
	public dynamicTiles: DynamicTile[] = [];
	public enemies: IEnemy[] = [];
	public player: [number, number];
	public gameSize: [number, number];
	public camera: [number, number];
	public end: Rectangle;
}