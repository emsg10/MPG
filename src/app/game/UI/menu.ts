import { RenderCall, Renderer } from '../render';
import { SceneHandler } from './sceneHandler';
import { Rectangle, Tile } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { Scene } from './scene';
import { Clickable } from './clickable';
import { PowerSelector } from './powerSelector';
import { SceneIndex } from './sceneIndex';
import { LocalStorageHelper } from '../service/localStorageHelper'

export class Menu extends Scene {

    constructor(
        public clickables: Clickable[],
        public text: Tile[],
        protected sceneHandler: SceneHandler,
        protected textArea: HTMLElement,
        protected renderer: Renderer,
        protected canvasSize: [number, number],
        protected background: number,
        protected tileSize: [number, number],
        protected menu: boolean) {
        super(sceneHandler, renderer, canvasSize, background, tileSize, menu);
        this.createRenderCalls();
    }

    public update() {
    }

    public load() {

        if(this.sceneHandler.currentScene == SceneIndex.StartMenu) {

            if(LocalStorageHelper.getInstance().getProgression().length > 0) {
                this.clickables[1].disabled = false;
            } else {
                this.clickables[1].disabled = true;
            }
        } 
    }

    public render() {
        let rendercall = new RenderCall();

        for (let clickable of this.clickables) {
            rendercall = clickable.createRenderCall(rendercall);
        }

        for(let t of this.text) {
            rendercall.vertecies = this.renderHelper.getVertecies(t.x, t.y, t.width, t.height, rendercall.vertecies);
            rendercall.indecies = this.renderHelper.getIndecies(rendercall.indecies);
            rendercall.textureCoords = this.renderHelper.getTextureCoordinates(rendercall.textureCoords, t.key);
        }

        this.renderCalls.set(-1, rendercall);

        this.renderer.render(this.renderCalls, [0, 0]);

        super.render();
    }

    public click(mousePosition: [number, number]) {
        for (let clickable of this.clickables) {
            clickable.click(mousePosition);
        }
    }

    public mouseOver(mousePosition: [number, number]) {
        for (let clickable of this.clickables) {
            clickable.mouseOver(mousePosition);
        }
    }

    protected createRenderCalls() {
        super.createRenderCalls();
    }

}