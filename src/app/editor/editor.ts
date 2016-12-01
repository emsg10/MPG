import { Tile } from '../../model';
import { Observable, Subscription, Observer } from 'rxjs';

export class Editor {
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

	public init(tileSizeX: number, tileSizeY: number, canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.tileSizeX = tileSizeX;
		this.tileSizeY = tileSizeY;

		var columnNumber = this.canvas.width / tileSizeX;
		var rowNumber = this.canvas.height / tileSizeY;

		for(var i = 0; i < columnNumber; i++) {
			this.tiles[i] = [];
			for(var j = 0; j < rowNumber; j++) {
				this.tiles[i][j] = new Tile(tileSizeX * i, tileSizeY * j, tileSizeX, tileSizeY, 0);
			}
		}

		this.initMouseEventListener(this.canvas);
	}

	private editTile(x:number, y: number) {
		var column = Math.floor(x/this.tileSizeX);
		var row = Math.floor(y/this.tileSizeY);

		if(this.tiles[column][row].tileTextureType != 1) {
			this.tiles[column][row].tileTextureType = 1;
			this.observer.next(null);
		}
		
	}

	private initMouseEventListener(canvas: HTMLCanvasElement) {

		canvas.addEventListener('click', (event: MouseEvent) => {

        var mousePos = this.getMousePos(canvas, event);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;

        this.editTile(mousePos.x, mousePos.y);

      }, false);
	}

	private getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        };
    }

    public tileEdited() {
		return new Observable((observer: any) => {
			this.observer = observer;
		});
	}

}