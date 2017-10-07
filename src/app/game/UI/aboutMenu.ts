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

export class AboutMenu extends Menu {

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

        let aboutCall = new RenderCall();

        aboutCall.vertecies = this.renderHelper.getVertecies(0, 0, this.canvasSize[0], this.canvasSize[1], aboutCall.vertecies);
        aboutCall.indecies = this.renderHelper.getIndecies(aboutCall.indecies);
        aboutCall.textureCoords = this.renderHelper.getTiledTextureCoordinates(new Rectangle(0, 0, this.canvasSize[0], this.canvasSize[0]), aboutCall.textureCoords, [1600, 1800]);
        aboutCall.key = 123;

        this.renderCalls.set(aboutCall.key, aboutCall);

        super.render();
    }
}