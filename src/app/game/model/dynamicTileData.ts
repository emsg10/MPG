import { Tile, Vector } from './';

export class DynamicTileData
{
	public tile: Tile;
	public velocity: Vector;
	public inverse: boolean;
	public verticalAxis: boolean;
	public distance: number;
}