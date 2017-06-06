import { Rectangle, DynamicTileData, RenderableData } from '../../model';

export class LevelData {
	
	public tiles: RenderableData[];
	public decorativeTiles: RenderableData[];
	public background: RenderableData[];
	public dynamicTiles: DynamicTileData[];
	public enemies: RenderableData[];
	public player: [number, number];
	public camera: [number, number];
	public gameSize: [number, number];
	public end: [number, number];
	
}