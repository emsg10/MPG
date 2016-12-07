import { Tile } from '../../model';
import { Observable, Subscription, Observer } from 'rxjs';
import { Context } from '../';
import { RenderCall } from '../render/renderCall';

export class Editor {
	public doneLoading: boolean = false;
	private observer: Observer<null>;
	private _tiles: Tile[][] = [];
	get tiles() {
		return this._tiles;
	}
	set tiles(value: Tile[][]) {
		this._tiles = value;
	}

	private tileSizeX: number;
	private tileSizeY: number;

	private canvas: HTMLCanvasElement;
	private editorContext: Context = new Context();

	private currentTileType: number = 1;
	private mouseDown: boolean = false;

	public init(tileSizeX: number, tileSizeY: number, canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.tileSizeX = tileSizeX;
		this.tileSizeY = tileSizeY;

		var columnNumber = this.canvas.width / tileSizeX;
		var rowNumber = this.canvas.height / tileSizeY;

		for(var i = 0; i < columnNumber; i++) {
			this.tiles[i] = [];
			for(var j = 0; j < rowNumber; j++) {
				this.tiles[i][j] = new Tile((tileSizeX * i) + (tileSizeX / 2), (tileSizeY * j) + (tileSizeY / 2), tileSizeX, tileSizeY, 0);
			}
		}

		this.initMouseEventListener(this.canvas);

		this.editorContext.doneListener().subscribe(() => {
			this.doneLoading = true;
			this.initEditorEventListener(this.editorContext.canvas);
		});

		this.editorContext.init(256, 256);
	}

	public tileEdited() {
		return new Observable((observer: any) => {
			this.observer = observer;
		});
	}

	public createRenderCall() {

		var rendercall = new RenderCall();

			var textureCoordinates = [
				0.0,  0.0,
			    0.5,  0.5,
			    0.5,  0.0,
			    0.0,  0.0,
			    0.5,  0.5,
			    0.0,  0.5
			];

			var vertecies = [
	     		0, 0,
	     		256, 256,
	     		256, 0,
	     		0, 0,
	     		256, 256,
	     		0, 256
	     	];

	     	var vertexIndices = [
	    		0, 1, 2, 3, 4, 5
	  		];

			rendercall.context = this.editorContext;
			rendercall.textureCoords = textureCoordinates;
			rendercall.vertecies = vertecies;
			rendercall.indecies = vertexIndices;

		return rendercall;
	}

	private initEditorEventListener(canvas: HTMLCanvasElement) {
		canvas.addEventListener('click', (event: MouseEvent) => {
        var mousePos = this.getMousePos(canvas, event);
 
        this.setSelectedTileType(mousePos.x, mousePos.y);

      }, false);
	}

	private setSelectedTileType(x: number, y: number) {

		var part = 256/5;

		var xpos = Math.floor(x/part);
		var ypos = Math.floor(y/part); 

		this.currentTileType = (xpos + (ypos * 5) + 1);
	}

	private editTile(x:number, y: number) {
		var column = Math.floor(x/this.tileSizeX);
		var row = Math.floor(y/this.tileSizeY);

		if(this.tiles[column][row].tileTextureType != this.currentTileType) {
			this.tiles[column][row].tileTextureType = this.currentTileType;
			this.observer.next(null);
		}
	}

	private initMouseEventListener(canvas: HTMLCanvasElement) {

		document.body.addEventListener('mousedown', (event: MouseEvent) => {
			this.mouseDown = true;
		}, false);

		document.body.addEventListener('mouseup', (event: MouseEvent) => {
			this.mouseDown = false;
		}, false);

		canvas.addEventListener('click', (event: MouseEvent) => {
			var mousePos = this.getMousePos(canvas, event);
		    this.editTile(mousePos.x, mousePos.y);
      	}, false);
		canvas.addEventListener('mousemove', (event: MouseEvent) => {
			if(this.mouseDown) {
				var mousePos = this.getMousePos(canvas, event);
		    	this.editTile(mousePos.x, mousePos.y);
			}
      	}, false);
	}

	private getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
    }
}