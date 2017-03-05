import { Particle } from '../particle/particle'
import { Vector, Tile, Rectangle, DebugElement } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { RenderCall } from '../render/renderCall';
import { CollisionDetection } from '../collision/collisionDetection';

export class DebuggHandler {

    public debugRects: DebugElement[] = [];
    private renderHelper = RenderHelper.getInstance();
    private static instance: DebuggHandler = new DebuggHandler();

    constructor() {
		if (DebuggHandler.instance) {
			throw new Error("Static class cant be instanced!");
		}

		DebuggHandler.instance = this;
	}

	public static getInstance() {
		return DebuggHandler.instance;
	}

    createRenderCall(renderCall: RenderCall) {

        for(let rect of this.debugRects) {
            if(rect.inverse) {
                renderCall.vertecies = this.renderHelper.getInverseVertecies(rect.area.x, rect.area.y, rect.area.width, rect.area.height, renderCall.vertecies);
            } else {
                renderCall.vertecies = this.renderHelper.getVertecies(rect.area.x, rect.area.y, rect.area.width, rect.area.height, renderCall.vertecies);
            }
            renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, 1);
			renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
            renderCall.color = this.renderHelper.getColor(renderCall.color, null);
		}
        
        return renderCall;
    }

}