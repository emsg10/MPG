import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AssetsLoader } from './service/assetsLoader';
import { Observable } from 'rxjs';
import { Asset, Level, Vector } from './model';
import { Game } from './game';
import { Editor } from './editor/editor';
import { LoadHelper } from './service/loadHelper';
import { Swordman } from './character/swordman';
import { Enemy } from './character/enemy';
import { LevelData } from './map/model';

@Component({
    selector: 'editor-view',
    templateUrl: './editor-view.component.html'
})

export class EditorViewComponent implements AfterViewInit {
    @ViewChild('gameCanvas') gameCanvas: ElementRef;
    @ViewChild('editor') editor: Editor;
    private loadHelper = LoadHelper.getInstance();
    private asset: Asset = new Asset();
    private game: Game;

    constructor(private assetsLoader: AssetsLoader) {
    }

    ngAfterViewInit() {
        Observable.forkJoin(
            this.assetsLoader.getVertexShader(),
            this.assetsLoader.getFragmentShader(),
            this.assetsLoader.getParticleVertexShader(),
            this.assetsLoader.getParticleFragmentShader(),
            this.assetsLoader.getTileTexture(),
            this.assetsLoader.getParticleTexture(),
            this.assetsLoader.getGenericParticleTexture(),
            this.assetsLoader.getLevel("2")
        ).subscribe(data => {
            this.asset.vertexShader = data[0] as string;
            this.asset.fragmentShader = data[1] as string;
            this.asset.particleVertexShader = data[2] as string;
            this.asset.particleFragmentShader = data[3] as string;
            
            this.asset.texture = data[4] as HTMLImageElement;
            this.asset.particleTexture = data[5] as HTMLImageElement;
            this.asset.genericParticleTexture = data[6] as HTMLImageElement;
            this.editor.levelData = data[7];

            this.editor.init(this.asset, this.gameCanvas.nativeElement);

            this.game = new Game(this.asset, this.editor.startElement.nativeElement, this.editor.restartElement.nativeElement, this.gameCanvas.nativeElement, this.editor.levelData);
        });
    }

    public levelLoaded() {
        this.game.reset(this.editor.levelData, this.editor.mouseRenderCall);
    }

}