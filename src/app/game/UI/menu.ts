import { RenderCall, Renderer } from '../render';
import { SceneHandler } from './sceneHandler';
import { Rectangle } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { Scene } from './scene';
import { Clickable } from './clickable';
import { SceneIndex } from './sceneIndex';

export class Menu extends Scene {

    constructor(protected sceneHandler: SceneHandler, protected renderer: Renderer, protected canvasSize: [number, number], private clickables: Clickable[]) {
        super(sceneHandler, renderer, canvasSize);
        this.createRenderCalls();
    }

    public update() {
    }

    public render() {
        
        let rendercall = new RenderCall();
        
        for(let clickable of this.clickables) {
            rendercall = clickable.createRenderCall(rendercall);
        }

        this.renderCalls.set(-1, rendercall);
        
        this.renderer.render(this.renderCalls, [0, 0]);
    }

    public click(mousePosition: [number, number]) {
        for(let clickable of this.clickables) {
            clickable.click(mousePosition);    
        }
    }

    public mouseOver(mousePosition: [number, number]) {
        for(let clickable of this.clickables) {
            clickable.mouseOver(mousePosition);    
        }
    }

    protected createRenderCalls() {
        super.createRenderCalls();
    }

}