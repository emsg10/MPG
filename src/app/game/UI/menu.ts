import { RenderCall, Renderer } from '../render';
import { SceneHandler } from './sceneHandler';
import { Rectangle } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { Scene } from './scene';
import { Clickable } from './clickable';
import { PowerSelector } from './powerSelector';
import { SceneIndex } from './sceneIndex';

export class Menu extends Scene {

    constructor(protected sceneHandler: SceneHandler,
        protected textArea: HTMLElement,
        protected renderer: Renderer,
        protected canvasSize: [number, number],
        protected background: number,
        protected tileSize: [number, number],
        protected menu: boolean,
        protected clickables: Clickable[]) {
        super(sceneHandler, renderer, canvasSize, background, tileSize, menu);
        this.createRenderCalls();
    }

    public update() {
    }

    public load() {
        
    }

    public render() {
        let rendercall = new RenderCall();

        for (let clickable of this.clickables) {
            rendercall = clickable.createRenderCall(rendercall);
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