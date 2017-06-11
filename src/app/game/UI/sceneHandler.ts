import { RenderCall, Renderer, RenderHelper } from '../render';
import { Observable, Observer } from 'rxjs';
import { Scene } from './scene';
import { SceneIndex } from './sceneIndex';
import { Menu } from './Menu';
import { Clickable } from './clickable';
import { Rectangle } from '../model';
import { LevelData } from '../map/model';
import { LoadHelper } from '../service/loadHelper';
import { Game } from '../game';

export class SceneHandler {

    public started = false;
    public currentScene = SceneIndex.StartMenu;
    private scenes: Map<number, Scene> = new Map<number, Scene>();
    private mousePosition: [number, number] = [-100, 0];
    private renderHelper = RenderHelper.getInstance();
    private click = false;
    private importClicked = false;

    private fileUploadButton = document.getElementById("fileupload");
    private fileUploadButtonHighlight = document.getElementById("fileuploadHighlight");
    private uploadInput = document.getElementById("importLink") as HTMLInputElement;
    private modal = document.getElementById("modal");

    private loadHelper = LoadHelper.getInstance();

    constructor(private renderer: Renderer, private canvasSize: [number, number], private canvas: HTMLElement, private game: Game) {

        let startMenu = new Menu(
            this,
            renderer,
            canvasSize,
            [
                this.createNewGameButton(),
                this.createContinueButton(),
                this.createLoadButton()
            ]
        );

        this.scenes.set(SceneIndex.StartMenu, startMenu);

        let loadMenu = new Menu(
            this,
            renderer,
            canvasSize,
            [
                this.createToStartMenuBack()
            ]
        );

        this.scenes.set(SceneIndex.LoadMenu, loadMenu);

        this.createEventListerners();
    }

    public update() {

        let currentScene = this.scenes.get(this.currentScene);

        if (this.click) {
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

    private createLoadButton() {

        let onClick = () => {
            this.currentScene = SceneIndex.LoadMenu;
            this.fileUploadButton.style.visibility = "visible";
        }

        return new Clickable(new Rectangle((this.canvasSize[0] / 2) - 150, 295, 300, 50), 179, 181, 183, onClick);
    }

    private createNewGameButton() {
        let onClick = () => {
            this.started = true;
        }

        return new Clickable(new Rectangle((this.canvasSize[0] / 2) - 150, 175, 300, 50), 179, 181, 182, onClick);
    }

    private createContinueButton() {
        let onClick = () => {

        }

        return new Clickable(new Rectangle((this.canvasSize[0] / 2) - 150, 235, 300, 50), 179, 181, 184, onClick);
    }

    private createToStartMenuBack() {
        let onClick = () => {
            this.currentScene = SceneIndex.StartMenu;

            this.fileUploadButton.style.visibility = "hidden";
            this.fileUploadButtonHighlight.style.visibility = "hidden";
        }

        return new Clickable(new Rectangle((this.canvasSize[0] / 2) - 150, 235, 300, 50), 179, 181, 186, onClick);
    }
}