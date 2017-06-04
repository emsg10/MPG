import { RenderCall, Renderer, RenderHelper } from '../render';
import { Scene } from './scene';
import { SceneIndex } from './sceneIndex';
import { StartMenu } from './startMenu';

export class SceneHandler {

    public started = false;
    private scenes: Map<number, Scene> = new Map<number, Scene>();
    private currentScene = SceneIndex.StartManu;
    private mousePosition: [number, number] = [-100, 0];
    private renderHelper = RenderHelper.getInstance();
    private click = false;

    constructor(private renderer: Renderer, canvasSize: [number, number], private canvas: HTMLElement) {
        let startMenu = new StartMenu(this, renderer, canvasSize);
        this.scenes.set(SceneIndex.StartManu, startMenu);
        this.createMouseEventListerner();
    }

    public update() {
        if(this.click) {
            this.scenes.get(this.currentScene).click(this.mousePosition);
        }
    }

    public render() {
        this.scenes.get(this.currentScene).render();
        this.renderer.render(this.createMouseRenderCall(), [0, 0]);
    }

    private createMouseRenderCall() {
        let renderCalls = new Map<number, RenderCall>()
        let renderCall = new RenderCall();

        renderCall.vertecies = this.renderHelper.getVertecies(this.mousePosition[0], this.mousePosition[1], 32, 32, renderCall.vertecies);
        renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
        renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, 180);

        renderCalls.set(-1, renderCall);

        return renderCalls;
    }

    private createMouseEventListerner() {
        window.addEventListener("mousemove", (event: MouseEvent) => {
            let relativeElement = this.canvas.getBoundingClientRect();
            let x = event.clientX - relativeElement.left;
            let y = event.clientY - relativeElement.top;

            this.mousePosition = [x, y];
        });

        window.addEventListener("mousedown", (event: MouseEvent) => {
            this.click = true;
        });

        window.addEventListener("mouseup", (event: MouseEvent) => {
            this.click = false;
        });
    }
}