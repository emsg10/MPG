import { RenderCall, Renderer, RenderHelper } from '../render';
import { CollisionDetection } from '../collision/collisionDetection';
import { Rectangle } from '../model';

export class Clickable {

    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();

    constructor(private area: Rectangle, private texture: number, private onClick: () => void) {
    }

    public click(mouseposition: [number, number]) {
        if(this.collisionDetection.aabbCheck(new Rectangle(mouseposition[0], mouseposition[1], 1, 1), this.area)) {
            this.onClick();
        };
    }

    public createRenderCall() {
        let renderCall = new RenderCall();

        renderCall.vertecies = this.renderHelper.getVertecies(this.area.x, this.area.y, this.area.width, this.area.height, renderCall.vertecies);
        renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
        renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, this.texture);

        return renderCall;
    }

}