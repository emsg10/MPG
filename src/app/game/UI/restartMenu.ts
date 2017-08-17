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

export class RestartMenu extends Menu {

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

        this.load();
    }

    public load() {
        this.clickables[1] = new Clickable(new Rectangle(this.canvasSize[0] / 2 + 200, 650, 250, 42), 179, 181, 558, this.getClickCall());
    }

    private getClickCall() {
        return () => {
            if (this.tempLevel != null) {
                this.game.loadLevel(this.tempLevel);
                this.sceneHandler.started = true;
            } else {
                this.assetLoader.getLevel(this.currentLevel.toString()).subscribe(it => {
                    this.game.loadLevel(it);
                    this.sceneHandler.started = true;
                });
            }
        }
    }
}