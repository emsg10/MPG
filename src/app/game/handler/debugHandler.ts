import { Particle } from '../particle/particle'
import { Vector, Tile, Rectangle, DebugElement } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { RenderCall } from '../render/renderCall';
import { CollisionDetection } from '../collision/collisionDetection';

export class DebugHandler {

    public debugRects: DebugElement[] = [];
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
            if(rect.inverse) {
                renderCall.vertecies = this.renderHelper.getInverseVertecies(rect.area.x - camera.x, rect.area.y - camera.y, rect.area.width, rect.area.height, renderCall.vertecies);
            } else {
                renderCall.vertecies = this.renderHelper.getVertecies(rect.area.x - camera.x, rect.area.y - camera.y, rect.area.width, rect.area.height, renderCall.vertecies);
            }
            renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, 1);
			renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
            renderCall.color = this.renderHelper.getColor(renderCall.color, null);
            renderCall.rotation = this.renderHelper.getRotation(renderCall.rotation, null);
		}
        
        return renderCall;
    }

}