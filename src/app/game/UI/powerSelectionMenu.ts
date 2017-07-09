import { Menu } from './menu';
import { RenderCall, Renderer } from '../render';
import { LocalStorageHelper } from '../service/localStorageHelper';
import { SceneHandler } from './sceneHandler';
import { Rectangle } from '../model';
import { RenderHelper } from '../render/renderHelper';
import { Scene } from './scene';
import { Clickable } from './clickable';
import { PowerSelector } from './powerSelector';
import { SceneIndex } from './sceneIndex';
import { Progress, Tile } from '../model';
import { SimpleClickable } from './simpleClickable';

export class PowerSelectionMenu extends Menu {

    private localStorageHelper = LocalStorageHelper.getInstance();
    private progress: Progress;
    private simpleClickables: [SimpleClickable, SimpleClickable];

    constructor(protected sceneHandler: SceneHandler,
        protected textArea: HTMLElement,
        protected renderer: Renderer,
        protected canvasSize: [number, number],
        protected background: number,
        protected tileSize: [number, number],
        protected menu: boolean,
        public clickables: Clickable[],
        public text: Tile[],
        private powerSelectors: [PowerSelector, PowerSelector, PowerSelector]) {
        super(clickables, text, sceneHandler, textArea, renderer, canvasSize, background, tileSize, menu);
        this.load();
        this.textArea.style.visibility = "hidden";
    }

    public render() {

        for (let powerSelector of this.powerSelectors) {
            this.renderCalls = powerSelector.render(this.renderCalls);
        }

        for (let simpleClickable of this.simpleClickables) {
            this.renderCalls = simpleClickable.createRenderCall(this.renderCalls);
        }

        super.render();
    }

    public click(mousePosition: [number, number]) {
        super.click(mousePosition);

        for (let powerSelector of this.powerSelectors) {
            if (this.getAvailablePoints() > 0) {
                powerSelector.click(mousePosition);
            }
        }

        for (let simpleClickable of this.simpleClickables) {
            if (this.getAvailablePoints() > 0) {
                simpleClickable.click(mousePosition);
            }
        }

        this.progress.fire = this.powerSelectors[0].getPoints();
        this.progress.frost = this.powerSelectors[1].getPoints();
        this.progress.defence = this.powerSelectors[2].getPoints();

        this.textArea.innerHTML = "Skillpoints:" + this.getAvailablePoints();

        this.localStorageHelper.saveProgress(this.progress);
    }

    public load() {
        this.progress = this.localStorageHelper.getCurrentProgress();

        let onHpClick = () => {
            this.progress.hp++;
        }

        let hpClickable = new SimpleClickable(new Rectangle(750, 100, 100, 100), 120, [100, 100], onHpClick);

        let onManaClick = () => {
            this.progress.mana++;
        }

        let manaClickable = new SimpleClickable(new Rectangle(950, 100, 100, 100), 121, [256, 256], onManaClick);

        this.simpleClickables = [hpClickable, manaClickable];

        this.powerSelectors[0].fill(this.progress.fire);
        this.powerSelectors[1].fill(this.progress.frost);
        this.powerSelectors[2].fill(this.progress.defence);

        this.textArea.style.visibility = "visible";
        this.textArea.innerHTML = "Skillpoints:" + this.getAvailablePoints();


    }

    private getAvailablePoints() {
        return (this.progress.level - (this.progress.fire + this.progress.frost + this.progress.defence + this.progress.hp + this.progress.mana));
    }


}