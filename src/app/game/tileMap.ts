import { Tile, Vector, Rectangle } from './model';
import { RenderCall } from './render/renderCall';
import { RenderHelper } from './render/renderHelper';
import { Constants } from './service/constants';

export class TileMap {

	public renderCalls: Map<number, RenderCall> = new Map<number, RenderCall>();

	private renderHelper = RenderHelper.getInstance();
	private constants = Constants.getInstance();
	private tileMap: Map<number, Tile[]> = new Map<number, Tile[]>();

	constructor(public tiles: Tile[]) {
		this.createStaticRenderCalls();
	}

	private createStaticRenderCalls() {

		for (let tile of this.tiles) {
			let set = this.tileMap.get(tile.key);
			if (set) {
				set.push(tile);
			} else {
				this.tileMap.set(tile.key, [tile]);
			}
		}

		this.tileMap.forEach((tiles: Tile[], key: number) => {
			let renderCall = new RenderCall();
			renderCall.key = key;

			for (let tile of tiles) {
				renderCall.vertecies = this.renderHelper.getVertecies(tile.x, tile.y, tile.width, tile.height, renderCall.vertecies);
				renderCall.textureCoords = this.renderHelper.getTiledTextureCoordinates(tile, renderCall.textureCoords, this.constants.tileSize);
				renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
			}

			this.renderCalls.set(renderCall.key, renderCall);
		});
	}

	public createGoalRenderCall(goal: Rectangle, renderCall: RenderCall) {

		renderCall.vertecies = this.renderHelper.getVertecies(goal.x, goal.y, goal.width, goal.height, renderCall.vertecies);
		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, 550);
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);

		return renderCall;
	}

	public createRenderCall(renderCalls: Map<number, RenderCall>) {

		this.renderCalls.forEach((renderCall: RenderCall, key: number) => {
			let set = renderCalls.get(key);

			if (!set) {
				renderCalls.set(key, new RenderCall());
				set = renderCalls.get(key);
			}

			set.vertecies.push.apply(set.vertecies, renderCall.vertecies);
			set.indecies.push.apply(set.indecies, renderCall.indecies);
			set.textureCoords.push.apply(set.textureCoords, renderCall.textureCoords);
		});

	}
}