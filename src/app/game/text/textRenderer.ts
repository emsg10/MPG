import { RenderHelper } from '../render/renderHelper';
import { RenderCall } from '../render/renderCall';
import { Context } from '../context';

export class TextRenderer {

	private renderHelper: RenderHelper = new RenderHelper();
	private context: Context;

	constructor(context: Context) {
		this.context = context;
	}

	public createTextRenderCall(sizeX: number, sizeY: number, type: number) {
		let renderCall = new RenderCall();

		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];

		vertecies = this.renderHelper.getVertecies(((this.context.gl.canvas.width/2) - (sizeX/2)), ((this.context.gl.canvas.height/2) - (sizeY/2)), sizeX, sizeY, vertecies);
		textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, type);
		indecies = this.renderHelper.getIndecies(indecies);

		renderCall.vertecies = vertecies;
		renderCall.textureCoords = textureCoords;
		renderCall.indecies = indecies;
		renderCall.context = this.context;

		return renderCall;
	}
}