import { Tile, Vector } from '../model';
import { RenderCall } from './render/renderCall';
import { RenderHelper } from './render/renderHelper';
import { TextureMapper } from './render/textureMapper';
import { Context } from './';

export class TileMap {
	public tiles: Tile[] = [];
	private textureMapper = new TextureMapper();
	private renderHelper = RenderHelper.getInstance();
	private context: Context;

	constructor() {
	}

	public create(context: Context, tiles: Tile[]) {
		this.tiles = tiles;
		this.context = context;
	}

	public createRenderCall(tiles: Tile[]) {

		let renderCall = new RenderCall();

		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];

		for(var i = 0; i < tiles.length; i++) {
			if(tiles[i].tileTextureType != 0) {
				vertecies = this.renderHelper.getVertecies(tiles[i].x, tiles[i].y, tiles[i].width, tiles[i].height, vertecies);
				textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, tiles[i].tileTextureType);
				indecies = this.renderHelper.getIndecies(indecies);
			}
		}

		renderCall.vertecies = vertecies;
		renderCall.textureCoords = textureCoords;
		renderCall.indecies = indecies;
		renderCall.context = this.context;

		return renderCall;
	}
}