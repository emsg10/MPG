import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Tile, Asset } from '../model';
import { Observable, Subscription, Observer } from 'rxjs';
import { Context } from '../';
import { RenderCall } from '../render/renderCall';
import { CollisionDetection } from '../collision/collisionDetection';
import { Preview } from './preview';

@Component({
	selector: 'editor',
	templateUrl: './editor.html'
})

export class Editor {
	@ViewChild('editorCanvas') editorCanvas: ElementRef;
	@ViewChild('preview') preview: Preview;

	public doneLoading: boolean = false;
	public tiles: Tile[] = [];
	public currentTile: Tile = new Tile(0, 0, 25, 25, 1);

	private canvas: HTMLCanvasElement;
	private editorContext: Context;
	private collisionDetection: CollisionDetection = CollisionDetection.getInstance();

	private mouseDown: boolean = false;
	private accuracy: number = 5;

	constructor() {
	}

	public init(asset: Asset, canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.preview.init(asset);

		this.createInputListeners(this.preview);
		this.initMouseEventListener(this.canvas);

		this.editorContext = new Context(asset, 256, 256, this.editorCanvas.nativeElement);
		this.initEditorEventListener(this.editorCanvas.nativeElement);
	}

	public createRenderCall() {

		var rendercall = new RenderCall();

		var textureCoordinates = [
			0.0, 0.0,
			0.5, 0.5,
			0.5, 0.0,
			0.0, 0.0,
			0.5, 0.5,
			0.0, 0.5
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

	private createInputListeners(preview: Preview) {
		this.preview.tileSizeXElement.addEventListener('input', (event: any) => {
			this.currentTile.width = +this.preview.tileSizeXElement.value;
			this.preview.currentTile = this.currentTile;
			this.preview.tileSizeXTextElement.innerHTML = this.preview.tileSizeXElement.value;
		}, false);

		this.preview.tileSizeYElement.addEventListener('input', (event: any) => {
			this.currentTile.height = +this.preview.tileSizeYElement.value;
			this.preview.currentTile = this.currentTile;
			this.preview.tileSizeYTextElement.innerHTML = this.preview.tileSizeYElement.value;
		}, false);
	}

	private setSelectedTileType(x: number, y: number) {

		var part = 256 / 5;

		var xpos = Math.floor(x / part);
		var ypos = Math.floor(y / part);

		this.currentTile.tileTextureType = (xpos + (ypos * 5) + 1);
		this.preview.currentTile = this.currentTile;
	}

	private editTile(x: number, y: number) {

		let newTile = this.getAccurateTile(x, y);

		let collision = false;
		for (let tile of this.tiles) {
			if (this.collisionDetection.aabbCheck(newTile, tile)) {
				collision = true;
			}
		}

		if (!collision) {
			this.tiles.push(newTile);
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