import { RenderCall, Renderer, RenderHelper } from '../render';
import { CollisionDetection } from '../collision/collisionDetection';
import { Rectangle } from '../model';

export class Clickable {

    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();
    private hover = false;

    private baseTextureCoords: number[];
    private hoverTextureCoords: number[];
    private textTextureCoords: number[];
     

    constructor(private area: Rectangle, private buttonTexture: number, private hoverTexture: number, private textTexture: number, private onClick: () => void) {
        this.baseTextureCoords = this.renderHelper.getTextureCoordinates([], buttonTexture);
        this.hoverTextureCoords = this.renderHelper.getTextureCoordinates([], hoverTexture);
        this.textTextureCoords = this.renderHelper.getTextureCoordinates([], textTexture);
    }

    public click(mouseposition: [number, number]) {
        if(this.isWithinArea(mouseposition)) {
            this.onClick();
        };
    }

    public mouseOver(mouseposition: [number, number]) {
        if(this.isWithinArea(mouseposition)) {
            this.hover = true;
        } else {
            this.hover = false;
        }
    }

    public createRenderCall(renderCall: RenderCall) {

        renderCall.vertecies = this.renderHelper.getVertecies(this.area.x, this.area.y, this.area.width, this.area.height, renderCall.vertecies);
        renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
        renderCall.textureCoords.push.apply(renderCall.textureCoords, this.getTexture());

        renderCall.vertecies = this.renderHelper.getVertecies(this.area.x, this.area.y, this.area.width, this.area.height, renderCall.vertecies);
        renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
        renderCall.textureCoords.push.apply(renderCall.textureCoords, this.textTextureCoords);

        return renderCall;
    }

    private isWithinArea(mouseposition: [number, number]) {
        return this.collisionDetection.aabbCheck(new Rectangle(mouseposition[0], mouseposition[1], 1, 1), this.area);
    }

    private getTexture() {
        if(this.hover) {
            return this.hoverTextureCoords;
        } else {
            return this.baseTextureCoords;
        }
    }

}