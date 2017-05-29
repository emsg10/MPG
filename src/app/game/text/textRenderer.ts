import { RenderHelper } from '../render/renderHelper';
import { RenderCall } from '../render/renderCall';
import { Context } from '../context';

export class TextRenderer {

	private renderHelper: RenderHelper = new RenderHelper();
	private context: Context;

	constructor(context: Context) {
		this.context = context;
	}

	public createTextRenderCall(sizeX: number, sizeY: number, type: number, renderCall: RenderCall, camera: [number, number]) {

		renderCall.vertecies = this.renderHelper.getVertecies(((this.context.gl.canvas.width/2) - (sizeX/2) + camera[0]), ((this.context.gl.canvas.height/2) - (sizeY/2) + camera[1]), sizeX, sizeY, renderCall.vertecies);
		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, type);
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);

		return renderCall;
	}
}