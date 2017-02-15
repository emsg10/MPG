import { Tile, Vector } from './model';
import { RenderCall } from './render/renderCall';
import { RenderHelper } from './render/renderHelper';
import { Context } from './';

export class TileMap {
	private renderHelper = RenderHelper.getInstance();
	private context: Context;

	constructor(context: Context) {
		this.context = context;
	}

	public createRenderCall(tiles: Tile[], renderCall: RenderCall) {

		for(var i = 0; i < tiles.length; i++) {
			if(tiles[i].tileTextureType != 0) {
				renderCall.vertecies = this.renderHelper.getVertecies(tiles[i].x, tiles[i].y, tiles[i].width, tiles[i].height, renderCall.vertecies);
				renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, tiles[i].tileTextureType);
				renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
			}
		}

		return renderCall;
	}
}