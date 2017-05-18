import { Particle } from '../particle/particle'
import { Vector, Tile, Rectangle, DebugElement } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { RenderCall } from '../render/renderCall';
import { CollisionDetection } from '../collision/collisionDetection';

export class DebugHandler {

    public debugRects: Rectangle[] = [];
    private renderHelper = RenderHelper.getInstance();
    private static instance: DebugHandler = new DebugHandler();

    constructor() {
		if (DebugHandler.instance) {
			throw new Error("Static class cant be instanced!");
		}

		DebugHandler.instance = this;
	}

	public static getInstance() {
		return DebugHandler.instance;
	}

    createRenderCall(renderCall: RenderCall, camera: Vector) {

        for(let rect of this.debugRects) {
            renderCall.vertecies = this.renderHelper.getVertecies(rect.x - camera.x, rect.y - camera.y, rect.width, rect.height, renderCall.vertecies);
            renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, 1);
			renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
		}
        
        return renderCall;
    }

}