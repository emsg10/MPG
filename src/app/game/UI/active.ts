import { RenderCall, Renderer, RenderHelper } from '../render';
import { CollisionDetection } from '../collision/collisionDetection';
import { Rectangle } from '../model';

export class Active {

    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();

    constructor(public value: number,
        public maxValue: number,
        public active: boolean,
        private area: Rectangle,
        private asset: number,
        private activeAsset: number,
        private size: [number, number]) {
    }

    public createRenderCall(renderCalls: Map<number, RenderCall>) {

        renderCalls = this.addRenderCall(renderCalls, this.asset, false);
        renderCalls = this.addRenderCall(renderCalls, this.activeAsset, true);

        return renderCalls;
    }

    public click(mouseposition: [number, number]) {
        if (this.isWithinArea(mouseposition)) {
            this.addPoint();
        };
    }

    public addPoint() {
        this.value++;
        if (this.value == this.maxValue) {
            this.active = true;
        }
    }

    public reset() {
        this.value = 0;
        this.active = false;
    }

    private addRenderCall(renderCalls: Map<number, RenderCall>, asset: number, partial: boolean) {
        let renderCall: RenderCall;

        if (renderCalls.has(asset)) {
            renderCall = renderCalls.get(asset);
        } else {
            renderCall = new RenderCall();
        }

        if (partial) {
            let area = new Rectangle(this.area.x, this.area.y, this.area.width, this.area.height * (this.value / this.maxValue));
            renderCall.textureCoords = this.renderHelper.getTiledTextureCoordinates(area, renderCall.textureCoords, this.size);
            renderCall.vertecies = this.renderHelper.getVertecies(area.x, area.y, area.width, area.height, renderCall.vertecies);
        } else {
            renderCall.textureCoords = this.renderHelper.getTiledTextureCoordinates(this.area, renderCall.textureCoords, this.size);
            renderCall.vertecies = this.renderHelper.getVertecies(this.area.x, this.area.y, this.area.width, this.area.height, renderCall.vertecies);
        }

        renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);


        renderCalls.set(asset, renderCall);

        return renderCalls;
    }


    private isWithinArea(mouseposition: [number, number]) {
        return this.collisionDetection.aabbCheck(new Rectangle(mouseposition[0], mouseposition[1], 1, 1), this.area);
    }
}