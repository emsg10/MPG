import { Tile, Vector, Rectangle } from './model';
import { RenderCall } from './render/renderCall';
import { RenderHelper } from './render/renderHelper';

export class TileMap {
	private renderHelper = RenderHelper.getInstance();

	constructor() {
	}

	public createRenderCall(tiles: Tile[], renderCall: RenderCall, camera: Vector) {

		for (let tile of tiles) {
			renderCall.vertecies = this.renderHelper.getVertecies(tile.x - camera.x, tile.y - camera.y, tile.width, tile.height, renderCall.vertecies);
			renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, tile.tileTextureType);
			renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
			renderCall.color = this.renderHelper.getColor(renderCall.color, null);
		}

		return renderCall;
	}

	public createGoalRenderCall(goal: Rectangle, renderCall: RenderCall, camera: Vector) {

		renderCall.vertecies = this.renderHelper.getVertecies(goal.x - camera.x, goal.y - camera.y, goal.width, goal.height, renderCall.vertecies);
		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, 550);
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
		renderCall.color = this.renderHelper.getColor(renderCall.color, null);

		return renderCall;
	}
}