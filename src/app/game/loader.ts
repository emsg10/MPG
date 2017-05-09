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
            this.assetsLoader.getVertexShader(),
            this.assetsLoader.getFragmentShader(),
            this.assetsLoader.getParticleVertexShader(),
            this.assetsLoader.getParticleFragmentShader(),
            this.assetsLoader.getSimpleParticleVertexShader(),
            this.assetsLoader.getSimpleParticleFragmentShader(),
            this.assetsLoader.getDynamicVertexShader(),
            this.assetsLoader.getDynamicFragmentShader(),
            this.assetsLoader.getTileTexture(),
            this.assetsLoader.getParticleTexture(),
            this.assetsLoader.getGenericParticleTexture(),
            this.assetsLoader.getLevel("2")
        ).subscribe(data => {
            this.asset.vertexShader = data[0] as string;
            this.asset.fragmentShader = data[1] as string;
            this.asset.particleVertexShader = data[2] as string;
            this.asset.particleFragmentShader = data[3] as string;
            this.asset.simpleParticleVertexShader = data[4] as string;
            this.asset.simpleParticleFragmentShader = data[5] as string;
            this.asset.dynamicVertexShader = data[6] as string;
            this.asset.dynamicFragmentShader = data[7] as string;

            this.asset.texture = data[8] as HTMLImageElement;
            this.asset.particleTexture = data[9] as HTMLImageElement;
            this.asset.genericParticleTexture = data[10] as HTMLImageElement;
            this.level = data[11];

            this.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
            this.start = document.getElementById("start");
            this.restart = document.getElementById("restart");

            this.game = new Game(this.asset, this.start, this.restart, this.canvas, this.level);
        });
    }

    public initialize() {
        
    }
}