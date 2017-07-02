import { Rectangle } from '../model';
import { RenderCall, RenderHelper } from '../render';
import { CollisionDetection } from '../collision/collisionDetection';

export class SimpleClickable {

    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();

    constructor(private area: Rectangle, private textureKey: number, private size: [number, number], private onClick: () => void) {
    }

    public click(mouseposition: [number, number]) {
        if (this.isWithinArea(mouseposition)) {
            this.onClick();
        };
    }

    public createRenderCall(renderCalls: Map<number, RenderCall>) {

        let renderCall: RenderCall;

        if (renderCalls.has(this.textureKey)) {
            renderCall = renderCalls.get(this.textureKey);
        } else {
            renderCall = new RenderCall();
        }

        renderCall.textureCoords = this.renderHelper.getTiledTextureCoordinates(this.area, renderCall.textureCoords, this.size);
        renderCall.vertecies = this.renderHelper.getVertecies(this.area.x, this.area.y, this.area.width, this.area.height, renderCall.vertecies);
        renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);


        renderCalls.set(this.textureKey, renderCall);

        return renderCalls;
    }

    private isWithinArea(mouseposition: [number, number]) {
        return this.collisionDetection.aabbCheck(new Rectangle(mouseposition[0], mouseposition[1], 1, 1), this.area);
    }
}