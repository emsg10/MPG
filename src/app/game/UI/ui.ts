import { Vector, Rectangle } from '../model';
import { RenderHelper, RenderCall } from '../render';
import { Bar, ProgressBar } from './bar';

export class UI {

    private renderHelper = RenderHelper.getInstance();

    private bars: Bar[] = [];
    private hpBar: ProgressBar = new ProgressBar();
    private manaBar: ProgressBar = new ProgressBar();

    constructor(maxHp: number, maxMana: number) {
        
        this.hpBar.bar = new Bar(10, 10, 150, 30, 150, 52);
        this.hpBar.content = new Bar(10, 10, 150, 30, 150, 54);
        this.hpBar.maxValue = maxHp;
        this.manaBar.bar = new Bar(180, 10, 150, 30, 150, 52);
        this.manaBar.content = new Bar(180, 10, 150, 30, 150, 53);
        this.manaBar.maxValue = maxMana;
        
        this.bars.push(this.hpBar.bar);
        this.bars.push(this.hpBar.content);
        this.bars.push(this.manaBar.bar);
        this.bars.push(this.manaBar.content);

    }

    public update(hp: number, mana: number) {
        let hpFactor = hp/this.hpBar.maxValue;
        this.hpBar.content.width = this.hpBar.content.maxWidth * hpFactor;

        let manaFactor = mana/this.manaBar.maxValue;
        this.manaBar.content.width = this.manaBar.content.maxWidth * manaFactor;
    }

    public createRenderCall(renderCall: RenderCall, camera: Vector) {

        for (let bar of this.bars) {
            renderCall.vertecies = this.renderHelper.getVertecies(bar.x, bar.y, bar.width, bar.height, renderCall.vertecies);
            renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, bar.textureNumber);
            renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
            renderCall.color = this.renderHelper.getColor(renderCall.color, null);
        }

        return renderCall;
    }
}