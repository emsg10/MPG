import { Rectangle, Tile } from '../model';
import { Menu } from "./menu";
import { Clickable } from "./clickable";
import { SceneHandler } from "./sceneHandler";
import { Renderer } from "../index";
import { RenderCall } from "../render/index";
import { SceneIndex } from "./sceneIndex";
import { LocalStorageHelper } from "../service/localStorageHelper";
import { AssetsLoader } from '../service/assetsLoader';
import { Game } from "../game";
import { LevelData } from "../map/model/index";

export class CreditMenu extends Menu {

    public currentLevel = 0;
    public tempLevel: LevelData;
    private assetLoader = new AssetsLoader();

    constructor(
        public clickables: Clickable[],
        public text: Tile[],
        protected sceneHandler: SceneHandler,
        protected textArea: HTMLElement,
        protected renderer: Renderer,
        protected canvasSize: [number, number],
        protected background: number,
        protected tileSize: [number, number],
        protected menu: boolean,
        private game: Game) {
        super(clickables, text, sceneHandler, textArea, renderer, canvasSize, background, tileSize, menu);
    }

    public render() {

        let creditsCall = new RenderCall();

        creditsCall.vertecies = this.renderHelper.getVertecies(0, 0, this.canvasSize[0], this.canvasSize[1], creditsCall.vertecies);
        creditsCall.indecies = this.renderHelper.getIndecies(creditsCall.indecies);
        creditsCall.textureCoords = this.renderHelper.getTiledTextureCoordinates(new Rectangle(0, 0, this.canvasSize[0], this.canvasSize[0]), creditsCall.textureCoords, [1600, 1800]);
        creditsCall.key = 122;

        this.renderCalls.set(creditsCall.key, creditsCall);

        super.render();
    }
}