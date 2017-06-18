import { RenderCall, Renderer } from '../render';
import { SceneHandler } from './sceneHandler';
import { Rectangle } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { Clickable } from './clickable';
import { SceneIndex } from './sceneIndex';

export class Scene {

    protected renderCalls: Map<number, RenderCall> = new Map<number, RenderCall>();
    protected renderHelper = RenderHelper.getInstance();

    constructor(protected sceneHandler: SceneHandler, protected renderer: Renderer, protected canvasSize: [number, number], protected background: number, protected tileSize: [number, number], protected menu: boolean) {
    }

    public update() {
    }

    public render() {
    }

    public click(mousePosition: [number, number]) {
    }

    public mouseOver(mousePosition: [number, number]) {
    }

    protected createRenderCalls() {
        this.renderCalls = this.createBackGround(this.renderCalls);

        if (this.menu) {
            this.renderCalls = this.createMenu(this.renderCalls);
        }
    }

    private createBackGround(renderCalls: Map<number, RenderCall>) {
        let background = new RenderCall();

        background.vertecies = this.renderHelper.getVertecies(0, 0, this.canvasSize[0], this.canvasSize[1], background.vertecies);
        background.indecies = this.renderHelper.getIndecies(background.indecies);
        background.textureCoords = this.renderHelper.getTiledTextureCoordinates(new Rectangle(0, 0, this.canvasSize[0], this.canvasSize[0]), background.textureCoords, this.tileSize);
        background.key = this.background;

        renderCalls.set(background.key, background);

        return renderCalls;
    }

    private createMenu(renderCalls: Map<number, RenderCall>) {
        let menu = new RenderCall();

        menu.vertecies = this.renderHelper.getVertecies((this.canvasSize[0] / 2) - 256, 50, 512, 700, menu.vertecies);
        menu.indecies = this.renderHelper.getIndecies(menu.indecies);
        menu.textureCoords = this.renderHelper.getTiledTextureCoordinates(new Rectangle(0, 0, 288, 295), menu.textureCoords, [512, 512]);
        menu.key = 101;

        renderCalls.set(menu.key, menu);

        return renderCalls;
    }
}