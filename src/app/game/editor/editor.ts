import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Tile, Asset, Vector, Level } from '../model';
import { Observable, Subscription, Observer } from 'rxjs';
import { Context } from '../';
import { RenderCall } from '../render/renderCall';
import { CollisionDetection } from '../collision/collisionDetection';
import { Preview } from './preview';
import { LoadHelper } from '../service/loadHelper';

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

	public doneLoading: boolean = false;
	public currentTile: Tile = new Tile(0, 0, 25, 25, 1);
	public level: Level;

	private canvas: HTMLCanvasElement;
	private editorContext: Context;
	private collisionDetection: CollisionDetection = CollisionDetection.getInstance();

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

		this.editorContext = new Context(asset, 256, 256, this.editorCanvas.nativeElement);
		this.initEditorEventListener(this.editorCanvas.nativeElement);
	}

	public createRenderCall() {

		var rendercall = new RenderCall();

		var textureCoordinates = [
			0.0, 0.0,
			0.25, 0.25,
			0.25, 0.0,
			0.0, 0.0,
			0.25, 0.25,
			0.0, 0.25
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

	public playerXValueChanged(value: number) {
		this.level.playerPosition.x = +value;
	}

	public playerYValueChanged(value: number) {
		this.level.playerPosition.y = +value;
	}

	public xValueChanged(value: number) {
		this.currentTile.width = value;
	}

	public yValueChanged(value: number) {
		this.currentTile.height = value;
	}

	public export() {
		let jsonLevel = JSON.stringify(this.level);
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
				this.level = level;
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

			this.setSelectedTileType(mousePos.x, mousePos.y);

		}, false);
	}

	private setSelectedTileType(x: number, y: number) {

		var part = 256 / 5;

		var xpos = Math.floor(x / part);
		var ypos = Math.floor(y / part);

		this.currentTile.tileTextureType = (xpos + (ypos * 5) + 1);
	}

	private editTile(x: number, y: number) {

		let newTile = this.getAccurateTile(x, y);

		let collision = false;
		for (let tile of this.level.tiles) {
			if (this.collisionDetection.aabbCheck(newTile, tile)) {
				collision = true;
			}
		}

		if (!collision) {
			this.level.tiles.push(newTile);
		}
	}

	private getAccurateTile(x: number, y: number) {
		let modX = x % this.accuracy;
		let modY = y % this.accuracy;
		x = x - modX;
		y = y - modY;

		let newTile = new Tile(x, y, this.currentTile.width, this.currentTile.height, this.currentTile.tileTextureType);

		return newTile;
	}

	private setCurrentTile(x: number, y: number) {
		this.currentTile = this.getAccurateTile(x, y);
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
			let mousePos = this.getMousePos(canvas, event);
			if (this.mouseDown) {
				this.editTile(mousePos.x, mousePos.y);
			} else {
				this.setCurrentTile(mousePos.x, mousePos.y);
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