import { RenderCall, Renderer } from '../render';
import { SceneHandler } from './sceneHandler';
import { Rectangle } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { Scene } from './scene';
import { Clickable } from './clickable';

export class StartMenu implements Scene {
    
    private renderCalls: Map<number, RenderCall> = new Map<number, RenderCall>();
    private renderHelper = RenderHelper.getInstance();
    private newGame: Clickable;

    constructor(private sceneHandler: SceneHandler, private renderer: Renderer, private canvasSize: [number, number]) {
        this.createNewGameButton();
        this.createRenderCalls();
    }

    public update() {

    }

    public render() {
        this.renderer.render(this.renderCalls, [0, 0]);
    }

    public click(mousePosition: [number, number]) {
        this.newGame.click(mousePosition);
    }

    private createRenderCalls() {
        this.renderCalls = this.createBackGround(this.renderCalls);
        this.renderCalls = this.createMenu(this.renderCalls);
        
        this.renderCalls.set(-1, this.newGame.createRenderCall());
    }

    private createBackGround(renderCalls: Map<number, RenderCall>) {
        let background = new RenderCall();

        background.vertecies = this.renderHelper.getVertecies(0, 0, this.canvasSize[0], this.canvasSize[1], background.vertecies);
        background.indecies = this.renderHelper.getIndecies(background.indecies);
        background.textureCoords = this.renderHelper.getTiledTextureCoordinates(new Rectangle(0, 0, this.canvasSize[0], this.canvasSize[0]), background.textureCoords, [512, 512]);
        background.key = 100;

        renderCalls.set(background.key, background);

        return renderCalls;
    }

    private createMenu(renderCalls: Map<number, RenderCall>) {
        let menu = new RenderCall();

        menu.vertecies = this.renderHelper.getVertecies((this.canvasSize[0]/2) - 256, 50, 512, 700, menu.vertecies);
        menu.indecies = this.renderHelper.getIndecies(menu.indecies);
        menu.textureCoords = this.renderHelper.getTiledTextureCoordinates(new Rectangle(0, 0, 288, 295), menu.textureCoords, [512, 512]);
        menu.key = 101;

        renderCalls.set(menu.key, menu);

        return renderCalls;
    }

    private createNewGameButton() {
        let onClick = () => {
            this.sceneHandler.started = true;
        }

        this.newGame = new Clickable(new Rectangle((this.canvasSize[0]/2)-150, 175, 300, 50), 179, onClick);
    }

}