import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { AssetsLoader } from './service/assetsLoader';
import { Observable } from 'rxjs';
import { Asset, Level, Vector } from './model';
import { Game } from './game';
import { Editor } from './editor/editor';
import { LoadHelper } from './service/loadHelper';

@Component({
  selector: 'editor-view',
  templateUrl: './editor-view.component.html'
})

export class EditorViewComponent implements AfterViewInit{
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
	    	this.assetsLoader.getTexture(),
            this.assetsLoader.getLevel("1")
        ).subscribe(data => {
            this.asset.vertexShader = data[0] as string;
            this.asset.fragmentShader = data[1] as string;
            this.asset.texture = data[2] as HTMLImageElement;

            this.editor.init(this.asset, this.gameCanvas.nativeElement);

            let level = new Level();
            level.playerPosition = data[3].playerPosition;
            level.tiles = data[3].tiles;

            this.editor.level = level;
            
            this.game = new Game(this.asset, this.editor.startElement.nativeElement, this.editor.restartElement.nativeElement, this.gameCanvas.nativeElement, this.editor.level, this.editor);
        });
    }

    public levelLoaded() {
        this.game.reset(this.editor.level);
    }

}