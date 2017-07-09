import { RenderCall, Renderer, RenderHelper } from '../render';
import { Observable, Observer } from 'rxjs';
import { Scene } from './scene';
import { SceneIndex } from './sceneIndex';
import { Menu } from './menu';
import { Clickable } from './clickable';
import { PowerSelector } from './powerSelector';
import { Active } from './active';
import { Rectangle } from '../model';
import { LevelData } from '../map/model';
import { LoadHelper } from '../service/loadHelper';
import { LocalStorageHelper } from '../service/localStorageHelper';
import { Game } from '../game';
import { AssetsLoader } from '../service/assetsLoader';
import { PowerSelectionMenu } from './powerSelectionMenu';
import { NewGameMenu } from "./newGameMenu";

export class SceneHandler {

    public started = false;
    public currentScene = SceneIndex.StartMenu;
    public lastCurrentScene = SceneIndex.StartMenu;
    private scenes: Map<number, Scene> = new Map<number, Scene>();
    private mousePosition: [number, number] = [-100, 0];
    private renderHelper = RenderHelper.getInstance();
    private click = false;
    private clicked = false;
    private importClicked = false;

    private playerlist = document.getElementById("playerlist");
    private textInput = document.getElementById("textinput") as HTMLInputElement;
    private textArea = document.getElementById("textarea");
    private fileUploadButton = document.getElementById("fileupload");
    private fileUploadButtonHighlight = document.getElementById("fileuploadHighlight");
    private uploadInput = document.getElementById("importLink") as HTMLInputElement;
    private modal = document.getElementById("modal");

    private loadHelper = LoadHelper.getInstance();
    private localStorageHelper = LocalStorageHelper.getInstance();
    private assetLoader = new AssetsLoader();

    constructor(private renderer: Renderer, private canvasSize: [number, number], private canvas: HTMLElement, private game: Game) {

        let startMenu = new Menu(
            [
                this.createNewGameButton(),
                this.createContinueButton(),
                this.createLoadButton()
            ],
            [],
            this,
            this.textArea,
            renderer,
            canvasSize,
            100,
            [512, 512],
            true,
        );

        startMenu.load();

        this.scenes.set(SceneIndex.StartMenu, startMenu);

        let loadMenu = new Menu(
            [
                this.createToStartMenuBack(new Rectangle((this.canvasSize[0] / 2) - 150, 235, 300, 50))
            ],
            [],
            this,
            this.textArea,
            renderer,
            canvasSize,
            100,
            [512, 512],
            true,
        );

        this.scenes.set(SceneIndex.LoadMenu, loadMenu);

        this.loadLevelSelectionScreen();
        this.loadLevelFinishedScreen();
        this.loadNewGameMenu();

        this.createEventListerners();
    }

    public update() {

        let currentScene = this.scenes.get(this.currentScene);

        if (this.currentScene != this.lastCurrentScene) {
            this.textArea.style.visibility = "hidden";
            currentScene.load();
        }

        this.lastCurrentScene = this.currentScene;

        if (this.click && !this.clicked) {
            this.clicked = true;
            currentScene.click(this.mousePosition);
        }

        currentScene.mouseOver(this.mousePosition);
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

    private loadLevelFinishedScreen() {

        let levelFinishedScene = new PowerSelectionMenu(
            this,
            this.textArea,
            this.renderer,
            this.canvasSize,
            100,
            [512, 512],
            false,
            [
                this.createNextLevelButton(false),
                this.createToStartMenuBack(new Rectangle(this.canvasSize[0] / 2 - 450, 650, 250, 42))
            ],
            [],
            [
                this.newPowerSelector(150, 100, 150, [105, 102, 106, 103, 107, 104]),
                this.newPowerSelector(350, 100, 150, [111, 108, 112, 109, 113, 110]),
                this.newPowerSelector(550, 100, 150, [117, 114, 118, 115, 119, 116])
            ]
        );

        this.scenes.set(SceneIndex.LevelFinished, levelFinishedScene);
    }

    private loadNewGameMenu() {
        let newGameMenu = new NewGameMenu(
            [
                this.createToStartMenuBack(new Rectangle(this.canvasSize[0] / 2 - 450, 650, 250, 42)),
                this.createToPowerSelectorMenuButton(true),
            ],
            [],
            this,
            this.textArea,
            this.renderer,
            this.canvasSize,
            100,
            [512, 512],
            false,
            this.textInput,
            this.playerlist
        );

        this.scenes.set(SceneIndex.NewGameMenu, newGameMenu);
    }

    private newPowerSelector(x: number, y: number, offset: number, assets: number[]) {

        let active1 = new Active(0, 1, false, new Rectangle(x, y, 100, 100), assets[0], assets[1], [100, 100])
        let active2 = new Active(0, 2, false, new Rectangle(x, y + offset, 100, 100), assets[2], assets[3], [100, 100])
        let active3 = new Active(0, 3, false, new Rectangle(x, y + offset * 2, 100, 100), assets[4], assets[5], [100, 100])

        return new PowerSelector([active1, active2, active3]);
    }

    private loadLevelSelectionScreen() {
        let levelSelectionMenu = new Menu(
            [
                ...this.createLevelMenuButtons(),
                this.createToStartMenuBackFromLevelMenu()
            ],
            [],
            this,
            this.textArea,
            this.renderer,
            this.canvasSize,
            100,
            [512, 512],
            false,
        );

        this.scenes.set(SceneIndex.LevelSelection, levelSelectionMenu);

        return levelSelectionMenu;
    }

    private createEventListerners() {
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
            this.clicked = false;
            this.click = false;
        });

        this.uploadInput.addEventListener("change", () => {
            let fileReader = new FileReader();
            fileReader.onload = (evt: ProgressEvent) => {
                this.uploadInput.value = "";
                let target = evt.target as FileReader;

                try {
                    let leveldata = JSON.parse(target.result) as LevelData;
                    if (this.loadHelper.validateLevelData(leveldata)) {
                        this.game.loadLevel(leveldata);
                        this.started = true;
                        this.fileUploadButton.style.visibility = "hidden";
                        this.fileUploadButtonHighlight.style.visibility = "hidden";
                    } else {
                        this.modal.style.display = "block";
                        this.modal.innerHTML += "Invalid level data!"
                    }
                } catch (e) {
                    this.modal.style.display = "block";
                    this.modal.innerHTML += "Error loading level!"
                }
            }

            fileReader.readAsText(this.uploadInput.files[0], "UTF-8")
        });
    }

    public levelCompleted(level: string) {
        this.started = false;
        this.localStorageHelper.setCurrentProgress((+level + 1));
        this.currentScene = SceneIndex.LevelFinished;
        this.scenes.get(this.currentScene).load();
    }

    private createLoadButton() {

        let onClick = () => {
            this.currentScene = SceneIndex.LoadMenu;
            this.fileUploadButton.style.visibility = "visible";
        }

        return new Clickable(new Rectangle((this.canvasSize[0] / 2) - 150, 295, 300, 50), 179, 181, 183, onClick);
    }

    private createNextLevelButton(disabled: boolean) {

        let onClick = () => {

            this.textInput.style.visibility = "hidden";
            this.textArea.style.visibility = "hidden";
            this.playerlist.style.visibility = "hidden";

            let progress = this.localStorageHelper.getCurrentProgress();
            this.assetLoader.getLevel(progress.completedLevels.toString()).subscribe(it => {
                this.game.loadLevel(it);
                this.started = true;
            });
        }

        let clickable: Clickable;

        if(disabled) {
            clickable = new Clickable(new Rectangle(this.canvasSize[0] / 2 + 200, 650, 250, 42), 179, 181, 553, onClick, 554);
        } else {
            clickable = new Clickable(new Rectangle(this.canvasSize[0] / 2 + 200, 650, 250, 42), 179, 181, 553, onClick);
        }

        return clickable;

    }

    private createToPowerSelectorMenuButton(disabled: boolean) {
         let onClick = () => {

            this.textInput.style.visibility = "hidden";
            this.textArea.style.visibility = "hidden";
            this.playerlist.style.visibility = "hidden";

            this.currentScene = SceneIndex.LevelFinished;
        }

        let clickable: Clickable;

        if(disabled) {
            clickable = new Clickable(new Rectangle(this.canvasSize[0] / 2 + 200, 650, 250, 42), 179, 181, 553, onClick, 554);
        } else {
            clickable = new Clickable(new Rectangle(this.canvasSize[0] / 2 + 200, 650, 250, 42), 179, 181, 553, onClick);
        }

        return clickable;
    }

    private createNewGameButton() {
        let onClick = () => {
            this.currentScene = SceneIndex.NewGameMenu;
        }

        return new Clickable(new Rectangle((this.canvasSize[0] / 2) - 150, 175, 300, 50), 179, 181, 182, onClick);
    }

    private createContinueButton() {
        let onClick = () => {
            this.currentScene = SceneIndex.LevelSelection;
        }

        return new Clickable(new Rectangle((this.canvasSize[0] / 2) - 150, 235, 300, 50), 179, 181, 184, onClick, 554);
    }

    private createToStartMenuBack(area: Rectangle) {
        let onClick = () => {
            this.currentScene = SceneIndex.StartMenu;

            this.fileUploadButton.style.visibility = "hidden";
            this.fileUploadButtonHighlight.style.visibility = "hidden";
            this.textArea.style.visibility = "hidden";
            this.textInput.style.visibility = "hidden";
            this.playerlist.style.visibility = "hidden";
        }

        return new Clickable(area, 179, 181, 186, onClick);
    }

    private createToStartMenuBackFromLevelMenu() {
        let onClick = () => {
            this.currentScene = SceneIndex.StartMenu;
        }

        return new Clickable(new Rectangle((this.canvasSize[0] / 2) - 150, 700, 300, 50), 179, 181, 186, onClick);
    }

    private createLevelMenuButtons() {
        let progress = this.localStorageHelper.getCurrentProgress();
        let clickables: Clickable[] = [];

        let collumns = 5;
        for (let i = 0; i < 10; i++) {
            let y = Math.floor(i / collumns);
            let x = i % collumns;
            let disabled = !(progress.completedLevels >= i);
            clickables.push(this.createLevelButton(x, y, i, disabled));
        }

        return clickables;
    }

    private createLevelButton(x: number, y: number, level: number, disabled: boolean) {

        let onClick: () => void;

        if (disabled) {
            onClick = () => {

            }
        } else {
            onClick = () => {
                this.assetLoader.getLevel(level.toString()).subscribe(it => {
                    this.game.loadLevel(it);
                    this.started = true;
                });
            }
        }


        let buttonTexture: number;
        if (disabled) {
            buttonTexture = 187;
        } else {
            buttonTexture = 550;
        }

        return new Clickable(new Rectangle(100 + (x * 200), 100 + (y * 200), 200, 100), buttonTexture, buttonTexture, 188 + level, onClick);
    }


}