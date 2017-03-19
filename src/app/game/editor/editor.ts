import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Tile, Asset, Vector, Level, Rectangle } from '../model';
import { Observable, Subscription, Observer } from 'rxjs';
import { Context } from '../';
import { RenderCall } from '../render/renderCall';
import { CollisionDetection } from '../collision/collisionDetection';
import { Preview } from './preview';
import { EditorCamera } from './editorCamera';
import { LoadHelper } from '../service/loadHelper';
import { RenderHelper } from '../render/renderHelper';
import { Renderer } from '../render/renderer';
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
	@ViewChild('editorCamera') editorCamera: EditorCamera;
	@ViewChild('start') startElement: ElementRef;
	@ViewChild('restart') restartElement: ElementRef;
	@ViewChild('importElement') importElement: ElementRef;

	@Output() levelChanged = new EventEmitter<void>();

	public mouseTile: Tile = new Tile(200, 200, 50, 50, 1);

	public currentTile: Tile = new Tile(0, 0, 25, 25, 1);
	public currentTileType: number = 1;
	public currentTileWidth: number = 25;
	public currentTileHeight: number = 25;
	public currentEnemy: EnemyData;
	public levelData: LevelData;
	public context: Context;
	public asset: Asset;

	public mouseRenderCall: RenderCall;

	private goalSelected = false;

	private latestGameSize: Vector;

	private renderHelper = RenderHelper.getInstance();
	private canvas: HTMLCanvasElement;

	private collisionDetection: CollisionDetection = CollisionDetection.getInstance();
	private mousePos: Vector;

	private anchor: Vector;
	private endPoint: Vector;

	private mouseDown: boolean = false;
	private accuracy: number = 5;
	private loadHelper = LoadHelper.getInstance();

	private editorRenderer: Renderer;
	private previewRenderer: Renderer;
	private editorCameraRenderer: Renderer;

	constructor() {
	}

	public init(asset: Asset, canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.asset = asset;
		this.preview.init(asset);
		this.editorCamera.init(asset);

		this.context = new Context(asset, 256, 512, this.editorCanvas.nativeElement);
		
		this.initEventListeners();

		this.editorRenderer = new Renderer(this.context);
		this.previewRenderer = new Renderer(this.preview.context);
		this.editorCameraRenderer = new Renderer(this.editorCamera.context);

		this.mouseRenderCall = new RenderCall();
		this.mouseRenderCall.vertecies = [];
		this.mouseRenderCall.textureCoords = [];
		this.mouseRenderCall.indecies = [];
		this.mouseRenderCall.color = [];

		this.latestGameSize = new Vector(this.editorCamera.gameSizeX, this.editorCamera.gameSizeY);
		this.editorCamera.cameraPosition = this.levelData.cameraPosition;
	}

	private render() {
		let renderCalls: RenderCall[] = [];
		renderCalls.push(this.createRenderCall());
		renderCalls.push(this.currentRenderCall(new Rectangle(0, 256, 56, 58), 211));
		renderCalls.push(this.currentRenderCall(new Rectangle(0, 450, 56, 58), 550));
		
		let previewRenderCalls: RenderCall[] = [];

		previewRenderCalls.push(this.preview.createRenderCall());

		this.previewRenderer.render(previewRenderCalls);
		this.editorRenderer.render(renderCalls);
		
		this.editorCamera.context.clear([0,0,0,0.95]);
		this.editorCameraRenderer.render([this.editorCamera.createRenderCall()]);

		if(this.currentTile != null) {
			this.mouseRenderCall = this.currentRenderCall(this.currentTile, this.currentTile.tileTextureType);
		} else if(this.currentEnemy){
			this.mouseRenderCall = this.currentRenderCall(this.currentEnemy.area, 211);
		}
		
	}

	public cameraChanged(event: Vector) {
		this.levelData.cameraPosition = event;
		this.levelChanged.emit();
	}

	public gameSizeChanged(event: Vector) {
		this.levelData.gameSize = event;
		this.latestGameSize = this.levelData.gameSize;
		this.levelChanged.emit();
	}

	public playerXValueChanged(value: number) {
		this.levelData.playerPosition.x = +value;
		this.levelChanged.emit();
	}

	public playerYValueChanged(value: number) {
		this.levelData.playerPosition.y = +value;
		this.levelChanged.emit();
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
		this.levelData.cameraPosition = new Vector(0, 0);
		this.levelData.gameSize = this.latestGameSize;
		this.levelChanged.emit();
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

	private initEventListeners() {
		this.initEditorEventListener(this.editorCanvas.nativeElement);
		this.initMouseEventListener(this.canvas);
		this.initImportChangeListener();

		Observable.interval(60).subscribe(it => {
			this.render();
		});
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
				this.levelChanged.emit();
			}
		} catch (error) {
			console.log("Invalid json");
		}
	}

	

	private setEnemyType(x: number, y: number) {
		if (x > 0 && x < 56 && y > 256 && y < 256 + 59) {
			let enemyData = new EnemyData();
			enemyData.area = new Rectangle(0, 0, 56, 59);
			enemyData.type = EnemyType.swordman;

			this.currentEnemy = enemyData;
		}

		if (x > 0 && x < 56 && y > 450 && y < 450 + 59) {
			this.currentEnemy = null;
			this.goalSelected = true;
		}
	}

	private setCurrentEnemy(x: number, y: number) {
		this.currentEnemy.area.x = x;
		this.currentEnemy.area.y = y;
		this.levelChanged.emit();
	}

	private setGoal(position: Vector) {
		this.levelData.goal = new Rectangle(position.x, position.y, 56, 59);
		this.levelChanged.emit();
	}

	private addEnemy(enemyPos: Vector) {
		let enemyData = new EnemyData();
		enemyData.area = new Rectangle(enemyPos.x, enemyPos.y, this.currentEnemy.area.width, this.currentEnemy.area.height);
		enemyData.type = EnemyType.swordman;
		this.levelData.enemies.push(enemyData);
		this.levelChanged.emit();
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
			this.levelChanged.emit();
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
		for (let tile of this.levelData.tiles) {
			if (this.collisionDetection.aabbCheck(rect, tile)) {
				colTile = tile;
			}
		}

		if (colTile) {
			let index = this.levelData.tiles.indexOf(colTile);
			if (index != -1) {
				this.levelData.tiles.splice(index, 1);
				this.levelChanged.emit();
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
		this.levelChanged.emit();
		return newTile;
	}

	private currentRenderCall(rect: Rectangle, textureType: number) {
		let renderCall = new RenderCall();
		renderCall.vertecies = [];
		renderCall.indecies = [];
		renderCall.textureCoords = [];
		renderCall.color = [];

		renderCall.vertecies = this.renderHelper.getVertecies(rect.x, rect.y, rect.width, rect.height, renderCall.vertecies);
		renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, textureType);
		renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
		renderCall.color = this.renderHelper.getColor(renderCall.color, null);

		return renderCall;
	}

	private createEnemyRenderCall() {
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

	private createRenderCall() {

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

	private destroyClickedElement(event: any) {
		document.body.removeChild(event.target);
	}

	private initEditorEventListener(canvas: HTMLCanvasElement) {
		canvas.addEventListener('click', (event: MouseEvent) => {
			var mousePos = this.getMousePos(canvas, event, true);

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
			} else if(this.currentEnemy){
				this.addEnemy(mousePos);
			} else if(this.goalSelected) {
				this.setGoal(this.mousePos);
			}

		}, false);
		canvas.addEventListener('mousemove', (event: MouseEvent) => {
			this.mousePos = this.getMousePos(canvas, event);
			if (this.currentTile != null) {
				if (this.mouseDown) {
					this.setEndPoint(this.mousePos.x, this.mousePos.y);
				} else {
					this.setCurrentTile(this.mousePos.x - this.editorCamera.cameraPosition.x, this.mousePos.y - this.editorCamera.cameraPosition.y);
				}
			} else if(this.currentEnemy){
				this.setCurrentEnemy(this.mousePos.x - this.editorCamera.cameraPosition.x, this.mousePos.y - this.editorCamera.cameraPosition.y);
			} 

		}, false);
	}

	private getMousePos(canvas: HTMLCanvasElement, event: MouseEvent, nonrelative?: boolean) {
		var rect = canvas.getBoundingClientRect();
		let mousePos = new Vector((event.clientX - rect.left), event.clientY - rect.top);

		if(!nonrelative) {
			mousePos.x += this.editorCamera.cameraPosition.x;
			mousePos.y += this.editorCamera.cameraPosition.y;
		}
		
		return mousePos;
	}
}