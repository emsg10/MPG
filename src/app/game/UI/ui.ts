import { Vector, Rectangle } from '../model';
import { RenderHelper, RenderCall } from '../render';
import { Bar, ProgressBar } from './bar';

export class UI {

    private renderHelper = RenderHelper.getInstance();

    private bars: Bar[] = [];
    private hpBar: ProgressBar = new ProgressBar();
    private manaBar: ProgressBar = new ProgressBar();
    private hudTextureCoords = this.renderHelper.getTextureCoordinates([], 198);
    
    constructor(maxHp: number, maxMana: number) {
        
        this.hpBar.bar = new Bar(new Rectangle(100, 8, 298, 16), 298, new Rectangle(1632, 96, 200, 12), 200);
        this.hpBar.maxValue = maxHp;
        this.manaBar.bar = new Bar(new Rectangle(100, 34, 298, 16), 298, new Rectangle(1632, 128, 200, 12), 200);
        this.manaBar.maxValue = maxMana;
        
        this.bars.push(this.hpBar.bar);
        this.bars.push(this.manaBar.bar);
    }

    public update(hp: number, mana: number) {
        let hpFactor = hp/this.hpBar.maxValue;
        this.hpBar.bar.area.width = (hpFactor * this.hpBar.bar.maxWidth);
        this.hpBar.bar.textureArea.width = (hpFactor * this.hpBar.bar.maxTextureWidth);

        let manaFactor = mana/this.manaBar.maxValue;
        this.manaBar.bar.area.width = (manaFactor * this.manaBar.bar.maxWidth);
        this.manaBar.bar.textureArea.width = (manaFactor * this.manaBar.bar.maxTextureWidth);

    }

    public createRenderCall(renderCall: RenderCall, camera: [number, number]) {

        renderCall.vertecies = this.renderHelper.getVertecies(0 + camera[0], 0 + camera[1], 405, 96, renderCall.vertecies);
        renderCall.textureCoords.push.apply(renderCall.textureCoords, this.hudTextureCoords);
        renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);

        for (let bar of this.bars) {
            renderCall.vertecies = this.renderHelper.getVertecies(bar.area.x + camera[0], bar.area.y + camera[1], bar.area.width, bar.area.height, renderCall.vertecies);
            renderCall.textureCoords.push.apply(renderCall.textureCoords, this.renderHelper.getMainTextureCoords(bar.textureArea));
            renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
        }

        return renderCall;
    }
}