import { Rectangle, Tile } from '../model';
import { Menu } from "./menu";
import { Clickable } from "./clickable";
import { SceneHandler } from "./sceneHandler";
import { Renderer } from "../index";
import { RenderCall } from "../render/index";
import { SceneIndex } from "./sceneIndex";
import { LocalStorageHelper } from "../service/localStorageHelper";

export class NewGameMenu extends Menu {

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
        private textInput: HTMLInputElement,
        private playerlist: HTMLElement) {
        super(clickables, text, sceneHandler, textArea, renderer, canvasSize, background, tileSize, menu);

        this.text.push(new Tile(75, 70, 200, 33, 557));

        let onClick = () => {
            let name = this.textInput.value;
            if (name.length > 0) {
                LocalStorageHelper.getInstance().newPlayer(name);
                this.checkProgressionExists();
                this.reDrawPlayerList();
            }
        }

        clickables.push(new Clickable(new Rectangle(150, 150, 200, 33), 179, 181, 555, onClick));

    }

    public load() {
        this.textInput.style.visibility = "visible";
        this.playerlist.style.visibility = "visible";

        this.reDrawPlayerList();

        this.checkProgressionExists();
    }

    private reDrawPlayerList() {
        while (this.playerlist.firstChild) {
            this.playerlist.removeChild(this.playerlist.firstChild);
        }

        this.playerlist.children
        let progression = LocalStorageHelper.getInstance().getProgression();

        for (let progress of progression) {
            let item = document.createElement("div");
            item.style.setProperty("color", "#ac9478", "important");
            item.style.textShadow = "-2px 0 #5d392c, 0 2px #5d392c, 2px 0 #5d392c, 0 -2px #5d392c";
            item.style.padding = "5px";

            item.innerHTML = progress.playerName;

            if (progress.active) {
                item.innerHTML = "➣ " + item.innerHTML;
            }

            item.onclick = () => {
                LocalStorageHelper.getInstance().setActive(progress.playerName);
                this.reDrawPlayerList();
            }

            this.playerlist.appendChild(item);
        }
    }

    private checkProgressionExists() {
        if (LocalStorageHelper.getInstance().getProgression().length > 0) {
            this.clickables[1].disabled = false;
        } else {
            this.clickables[1].disabled = true;
        }
    }
}