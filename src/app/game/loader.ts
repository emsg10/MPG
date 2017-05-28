import { AssetsLoader } from './service/assetsLoader';
import { Observable } from 'rxjs';
import { Asset, Level, Vector } from './model';
import { Game } from './game';
import { LoadHelper } from './service/loadHelper';
import { Swordman } from './character/swordman';
import { Enemy } from './character/enemy';
import { LevelData } from './map/model';

export class Loader {
    private loadHelper = LoadHelper.getInstance();
    private asset: Asset = new Asset();
    private assetsLoader = new AssetsLoader();
    private level: LevelData;
    private game: Game;

    private canvas: HTMLCanvasElement;
    private start: HTMLElement;
    private restart: HTMLElement;

    constructor() {

        Observable.forkJoin(
            this.assetsLoader.getShader("vertexShader.c"),
            this.assetsLoader.getShader("fragmentShader.c"),
            this.assetsLoader.getShader("simpleParticleVertexShader.c"),
            this.assetsLoader.getShader("simpleParticleFragmentShader.c"),
            this.assetsLoader.getShader("dynamicVertexShader.c"),
            this.assetsLoader.getShader("dynamicFragmentShader.c"),
            this.assetsLoader.getShader("colorVertexShader.c"),
            this.assetsLoader.getShader("colorFragmentShader.c"),
            this.assetsLoader.getTexture("tiles.png"),
            this.assetsLoader.getTexture("particleSprites.png"),
            this.assetsLoader.getTexture("genericParticle.png"),
            this.assetsLoader.getTileTextures("tile"),
            this.assetsLoader.getLevel("1")
        ).subscribe(data => {
            this.asset.vertexShader = data[0] as string;
            this.asset.fragmentShader = data[1] as string;
            this.asset.simpleParticleVertexShader = data[2] as string;
            this.asset.simpleParticleFragmentShader = data[3] as string;
            this.asset.dynamicVertexShader = data[4] as string;
            this.asset.dynamicFragmentShader = data[5] as string;
            this.asset.colorVertexShader = data[6] as string;
            this.asset.colorFragmentShader = data[7] as string;

            this.asset.texture = data[8] as HTMLImageElement;
            this.asset.particleTexture = data[9] as HTMLImageElement;
            this.asset.genericParticleTexture = data[10] as HTMLImageElement;
            this.asset.tileAssets = data[11];
            this.level = data[12] as LevelData;

            this.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
            this.start = document.getElementById("start");
            this.restart = document.getElementById("restart");

            this.game = new Game(this.asset, this.start, this.restart, this.canvas, this.level);
        });
    }

    public initialize() {

    }
}