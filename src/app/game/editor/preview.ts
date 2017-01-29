import { Component, ViewChild, ElementRef, Output, Input, EventEmitter } from '@angular/core';
import { Context } from '../context';
import { Tile, Asset } from '../model';
import { RenderCall } from '../render/renderCall';
import { RenderHelper } from '../render/renderHelper';

@Component({
	selector: 'preview',
	templateUrl: './preview.html'
})

export class Preview {
	@Input() currentTile: Tile = new Tile(0, 0, 25, 25, 1);
	@Output() onXvalueChange = new EventEmitter<number>();
	@Output() onYvalueChange = new EventEmitter<number>();

	@ViewChild('previewCanvas') previewCanvas: ElementRef;
	public tileSizeXElement: HTMLInputElement;
	public tileSizeXTextElement: HTMLSpanElement;
	public tileSizeYElement: HTMLInputElement;
	public tileSizeYTextElement: HTMLSpanElement;
	public xValue = 25;
	public yValue = 25;
	private previewContext: Context;
	private renderHelper: RenderHelper = RenderHelper.getInstance();


	constructor() {
	}

	public init(asset: Asset) {
		this.previewContext = new Context(asset, 150, 150, this.previewCanvas.nativeElement);
	}

	public createRenderCall() {
		let renderCall = new RenderCall();

		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];

		vertecies = this.renderHelper.getVertecies((75 - (this.currentTile.width / 2)), 75 - (this.currentTile.height / 2), this.currentTile.width, this.currentTile.height, vertecies);
		textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, this.currentTile.tileTextureType);
		indecies = this.renderHelper.getIndecies(indecies);

		renderCall.vertecies = vertecies;
		renderCall.textureCoords = textureCoords;
		renderCall.indecies = indecies;
		renderCall.context = this.previewContext;

		return renderCall;
	}

	public xValueChange(value: number) {
		this.xValue = +value;
		this.currentTile.width = this.xValue;
		this.onXvalueChange.emit(this.xValue);
	}

	public yValueChange(value: number) {
		this.yValue = +value;
		this.currentTile.height = this.yValue;
		this.onYvalueChange.emit(this.yValue);
	}
}