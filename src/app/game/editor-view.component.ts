import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { AssetsLoader } from './service/assetsLoader';
import { Observable } from 'rxjs';
import { Asset, Level, Vector } from './model';
import { Game } from './game';
import { Editor } from './editor/editor';

@Component({
  selector: 'editor-view',
  templateUrl: './editor-view.component.html'
})

export class EditorViewComponent implements AfterViewInit{

    @ViewChild('start') startElement: ElementRef;
    @ViewChild('gameCanvas') gameCanvas: ElementRef;
    @ViewChild('editor') editor: Editor;

    constructor(private assetsLoader: AssetsLoader) {
    }

    ngAfterViewInit() {
        Observable.forkJoin(
			this.assetsLoader.getVertexShader(),
	    	this.assetsLoader.getFragmentShader(),
	    	this.assetsLoader.getTexture()
        ).subscribe(data => {
            let asset = new Asset();
            asset.vertexShader = data[0] as string;
            asset.fragmentShader = data[1] as string;
            asset.texture = data[2] as HTMLImageElement;

            this.editor.init(asset, this.gameCanvas.nativeElement);

            let level = new Level();
            level.playerPosition = new Vector(200, 600);
            level.tiles = this.editor.tiles;

            let game = new Game(asset, this.startElement.nativeElement, this.gameCanvas.nativeElement, level, this.editor);
        });
    }

}