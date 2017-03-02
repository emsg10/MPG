import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Tile, Asset, Vector, Level, Rectangle } from '../model';
import { Observable, Subscription, Observer } from 'rxjs';
import { Context } from '../';
import { RenderCall } from '../render/renderCall';
import { CollisionDetection } from '../collision/collisionDetection';
import { Preview } from './preview';
import { LoadHelper } from '../service/loadHelper';
import { RenderHelper } from '../render/renderHelper';
import { TextureMapper } from '../render/textureMapper';
import { Enemy } from '../character/enemy';
import { Swordman } from '../character/swordman';
import { LevelData, EnemyData, EnemyType } from '../map/model';

@Component({
	selector: 'editor',
	templateUrl: './editor.html'
})

export class Editor {
	@ViewChild('editorCanvas') editorCanvas: ElementRef;
	@ViewChild('preview') preview: Preview;
	@ViewChild('start') startElement: ElementRef;
	@ViewChild('restart') restartElement: ElementRef;
	@ViewChild('importElement') importElement: ElementRef;

	@Output() newLevelLoaded = new EventEmitter<boolean>();
	@Output() levelChanged = new EventEmitter<boolean>();

	public doneLoading: boolean = false;
	public currentTiles: Tile[] = [];
	public currentTile: Tile = new Tile(0, 0, 25, 25, 1);
	public currentTileType: number = 1;
	public currentTileWidth: number = 25;
	public currentTileHeight: number = 25;
	public currentEnemy: EnemyData;
	public levelData: LevelData;
	public context: Context;

	private renderHelper = RenderHelper.getInstance();
	private textureMapper = TextureMapper.getInstance();
	private canvas: HTMLCanvasElement;
	
	private collisionDetection: CollisionDetection = CollisionDetection.getInstance();
	private mousePos: Vector;

	private anchor: Vector;
	private endPoint: Vector;

	private mouseDown: boolean = false;
	private accuracy: number = 5;
	private loadHelper = LoadHelper.getInstance();

	constructor() {
	}

	public init(asset: Asset, canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.preview.init(asset);

		this.initMouseEventListener(this.canvas);
		this.initImportChangeListener();

		this.context = new Context(asset, 256, 512, this.editorCanvas.nativeElement);
		this.initEditorEventListener(this.editorCanvas.nativeElement);
	}

	public currentEnemyRenderCall(context: Context) {
		let renderCall = new RenderCall();

		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];
		let color: number[] = [];
		let textureNumber = 0;

		if (this.currentEnemy != null) {
			vertecies = this.renderHelper.getVertecies(this.currentEnemy.area.x, this.currentEnemy.area.y, this.currentEnemy.area.width, this.currentEnemy.area.height, vertecies);
			if (this.currentEnemy.type == EnemyType.swordman) {
				textureNumber = 211
			}
			textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, textureNumber);
			indecies = this.renderHelper.getIndecies(indecies);
			color = this.renderHelper.getColor(color, null);
		}

		renderCall.vertecies = vertecies;
		renderCall.textureCoords = textureCoords;
		renderCall.indecies = indecies;
		renderCall.color = color;

		return renderCall;
	}

	public createEnemyRenderCall() {
		let renderCall = new RenderCall();

		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];
		var colors: number[] = [];

		vertecies = this.renderHelper.getVertecies(0, 256, 56, 58, vertecies);
		textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, 211);
		indecies = this.renderHelper.getIndecies(indecies);
		colors = this.renderHelper.getColor(colors, null);

		renderCall.vertecies = vertecies;
		renderCall.textureCoords = textureCoords;
		renderCall.indecies = indecies;
		renderCall.color = colors;

		return renderCall;
	}

	public createRenderCall() {

		let rendercall = new RenderCall();

		let textureCoordinates = [
			0.0, 0.0,
			0.125, 0.125,
			0.125, 0.0,
			0.0, 0.0,
			0.125, 0.125,
			0.0, 0.125
		];

		let vertecies = [
			0, 0,
			256, 256,
			256, 0,
			0, 0,
			256, 256,
			0, 256
		];

		let vertexIndices = [
			0, 1, 2, 3, 4, 5
		];

		rendercall.textureCoords = textureCoordinates;
		rendercall.vertecies = vertecies;
		rendercall.indecies = vertexIndices;
		rendercall.color = RenderHelper.getInstance().getColor([], null);

		return rendercall;
	}

	public playerXValueChanged(value: number) {
		this.levelData.playerPosition.x = +value;
		this.levelChanged.emit(true);
	}

	public playerYValueChanged(value: number) {
		this.levelData.playerPosition.y = +value;
		this.levelChanged.emit(true);
	}

	public xValueChanged(value: number) {
		this.currentTileWidth = value;
	}

	public yValueChanged(value: number) {
		this.currentTileHeight = value;
	}

	public clear() {
		this.levelData.tiles = [];
		this.levelData.playerPosition = new Vector(200, 200);
		this.levelData.enemies = [];
		this.levelChanged.emit(true);
	}

	public export() {
		let jsonLevel = JSON.stringify(this.levelData);
		let blob = new Blob([jsonLevel], { type: "application/json" });
		let textToSaveAsURL = window.URL.createObjectURL(blob);
		let fileNameToSaveAs = "level" + Date.now() + ".json";

		let downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		downloadLink.href = textToSaveAsURL;
		downloadLink.onclick = this.destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);

		downloadLink.click();
	}

	public import() {

		this.importElement.nativeElement.click();

	}

	private initImportChangeListener() {
		this.importElement.nativeElement.addEventListener('change', () => {
			let editorComp = this;
			let fileReader = new FileReader();
			fileReader.onload = (fileLoadedEvent: any) => {
				editorComp.loadLevel(fileLoadedEvent.target.result);
			}

			fileReader.readAsText(this.importElement.nativeElement.files[0], "UTF-8")
		});
	}

	private loadLevel(data: string) {
		try {
			let level = JSON.parse(data);
			if (this.loadHelper.checkLevelType(level)) {
				this.levelData = level;
				this.newLevelLoaded.emit(true);
			}
		} catch (error) {
			console.log("Invalid json");
		}
	}

	private destroyClickedElement(event: any) {
		document.body.removeChild(event.target);
	}

	private initEditorEventListener(canvas: HTMLCanvasElement) {
		canvas.addEventListener('click', (event: MouseEvent) => {
			var mousePos = this.getMousePos(canvas, event);

			if (mousePos.y > 256) {
				this.setEnemyType(mousePos.x, mousePos.y);
				this.currentTile = null;
			} else {
				this.setSelectedTileType(mousePos.x, mousePos.y);
				this.currentTile = this.getAccurateTile(mousePos.x, mousePos.y);
				this.currentEnemy = null;
			}


		}, false);
	}

	private setEnemyType(x: number, y: number) {
		if (x > 0 && x < 56 && y > 256 && y < 256 + 59) {
			let enemyData = new EnemyData();
			enemyData.area = new Rectangle(0, 0, 56, 59);
			enemyData.type = EnemyType.swordman;

			this.currentEnemy = enemyData;
		}
	}

	private setCurrentEnemy(x: number, y: number) {
		this.currentEnemy.area.x = x;
		this.currentEnemy.area.y = y;
	}

	private addEnemy() {
		let enemyData = new EnemyData();
		enemyData.area = new Rectangle(this.currentEnemy.area.x, this.currentEnemy.area.y, this.currentEnemy.area.width, this.currentEnemy.area.height);
		enemyData.type = EnemyType.swordman;
		this.levelData.enemies.push(enemyData);
		this.levelChanged.emit(true);
	}

	private setSelectedTileType(x: number, y: number) {

		var part = 256 / 5;

		var xpos = Math.floor(x / part);
		var ypos = Math.floor(y / part);

		this.currentTileType = (xpos + (ypos * 5) + 1);
	}

	private editTile(x: number, y: number) {

		let newTile = this.getAccurateTile(x, y);

		let collision = false;
		for (let tile of this.levelData.tiles) {
			if (this.collisionDetection.aabbCheck(newTile, tile)) {
				collision = true;
			}
		}

		if (!collision) {
			this.levelData.tiles.push(newTile);
			this.levelChanged.emit(true);
		}
	}

	private setAnchor(x: number, y: number) {
		this.anchor = new Vector(x, y);
	}

	private setEndPoint(x: number, y: number) {
		this.endPoint = new Vector(x, y);

		this.setAchorToEndPoint();
	}

	private setAchorToEndPoint() {

		this.currentTiles = [];

		let distanceX = this.anchor.x - this.endPoint.x;
		let distanceY = this.anchor.y - this.endPoint.y;
		let absDistanceX = Math.abs(distanceX);
		let absDistanceY = Math.abs(distanceY);

		if (absDistanceX > absDistanceY) {
			for (let i = 1; i <= (absDistanceX / this.currentTile.width); i++) {
				if (distanceX < 0) {
					this.editTile(this.anchor.x + (this.currentTile.width * i), this.anchor.y);
				} else {
					this.editTile(this.anchor.x - (this.currentTile.width * i), this.anchor.y);
				}
			}
		} else {
			for (let i = 1; i <= (absDistanceY / this.currentTile.height); i++) {
				if (distanceY < 0) {
					this.editTile(this.anchor.x, this.anchor.y + (this.currentTile.height * i));
				} else {
					this.editTile(this.anchor.x, this.anchor.y - (this.currentTile.height * i));
				}
			}
		}
	}

	private removeTile(position: Vector) {
		let rect = new Rectangle(position.x, position.y, 1, 1);
		let colTile: Tile;
		for(let tile of this.levelData.tiles) {
			if(this.collisionDetection.aabbCheck(rect, tile)) {
				colTile = tile;
			}
		}

		if(colTile) {
			let index = this.levelData.tiles.indexOf(colTile);
			if(index != -1) {
				this.levelData.tiles.splice(index, 1);
				this.levelChanged.emit(true);
			}
		}
		
	}

	private getAccurateTile(x: number, y: number) {
		let modX = x % this.accuracy;
		let modY = y % this.accuracy;
		x = x - modX;
		y = y - modY;

		let newTile = new Tile(x, y, this.currentTileWidth, this.currentTileHeight, this.currentTileType);

		return newTile;
	}

	private setCurrentTile(x: number, y: number) {
		let newTile = this.getAccurateTile(x, y);
		this.currentTile = newTile;
		return newTile;
	}

	private initMouseEventListener(canvas: HTMLCanvasElement) {

		document.body.addEventListener('mousedown', (event: MouseEvent) => {
			this.mouseDown = true;
		}, false);

		document.body.addEventListener('mouseup', (event: MouseEvent) => {
			this.mouseDown = false;

			if (this.endPoint) {
				this.setAchorToEndPoint();
			}

			this.endPoint = null;

		}, false);

		document.body.addEventListener('keydown', (event: KeyboardEvent) => {
			var keyCode = event.code;

			switch (keyCode) {
				case 'Delete':
					this.removeTile(this.mousePos);
					break;
			}
		}, false);

		canvas.addEventListener('mousedown', (event: MouseEvent) => {
			var mousePos = this.getMousePos(canvas, event);
			if (this.currentTile) {
				this.editTile(mousePos.x, mousePos.y);
				this.setAnchor(mousePos.x, mousePos.y);
			} else {
				this.addEnemy();
			}

		}, false);
		canvas.addEventListener('mousemove', (event: MouseEvent) => {
			this.mousePos = this.getMousePos(canvas, event);
			if (this.currentTile != null) {
				if (this.mouseDown) {
					this.setEndPoint(this.mousePos.x, this.mousePos.y);
				} else {
					this.setCurrentTile(this.mousePos.x, this.mousePos.y);
				}
			} else {
				this.setCurrentEnemy(this.mousePos.x, this.mousePos.y);
			}

		}, false);
	}

	private getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
		var rect = canvas.getBoundingClientRect();
		return new Vector(event.clientX - rect.left, event.clientY - rect.top);
	}
}