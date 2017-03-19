import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Tile, Asset, Vector, Level, Rectangle } from '../model';
import { Observable, Subscription, Observer } from 'rxjs';
import { Context } from '../';
import { RenderCall } from '../render/renderCall';
import { CollisionDetection } from '../collision/collisionDetection';
import { Preview } from './preview';
import { LoadHelper } from '../service/loadHelper';
import { RenderHelper } from '../render/renderHelper';
import { Renderer } from '../render/renderer';
import { TextureMapper } from '../render/textureMapper';
import { Enemy } from '../character/enemy';
import { Swordman } from '../character/swordman';
import { LevelData, EnemyData, EnemyType } from '../map/model';

@Component({
    selector: 'editorCamera',
    templateUrl: './editorCamera.html'
})

export class EditorCamera {
    @ViewChild('cameraCanvas') canvas: ElementRef;
    @Output() cameraChanged = new EventEmitter<Vector>();
    @Output() gameSizeChanged = new EventEmitter<Vector>();

    public cameraPosition = new Vector(0, 0);

    public gameSizeX: number = 3600;
    public gameSizeY: number = 1600;
    public context: Context;

    private editorCameraCanvasSize = 256;
    private mousePos = new Vector(0, 0);
    private cameraSizeX: number = 1200;
    private cameraSizeY: number = 800
    private renderHelper = RenderHelper.getInstance();
    private renderer: Renderer;

    constructor() {
    }

    public init(asset: Asset) {
        this.context = new Context(asset, this.editorCameraCanvasSize, this.editorCameraCanvasSize, this.canvas.nativeElement);

        this.initEventListeners();
    }

    public createRenderCall() {
        let renderCall = new RenderCall();

        let relWidth = (this.cameraSizeX/this.gameSizeX) * this.editorCameraCanvasSize;
        let relHeight = (this.cameraSizeY/this.gameSizeY) * this.editorCameraCanvasSize;

        renderCall.vertecies = this.renderHelper.getVertecies(this.mousePos.x, this.mousePos.y, relWidth, relHeight, renderCall.vertecies);
        renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, 500);
        renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
        renderCall.color = this.renderHelper.getColor(renderCall.color, null);

        return renderCall;
    }

    private updateCameraPosition(mousePos: Vector) {
        this.cameraPosition.x = mousePos.x * Math.floor(this.gameSizeX/this.editorCameraCanvasSize);
        this.cameraPosition.y = mousePos.y * Math.floor(this.gameSizeY/this.editorCameraCanvasSize);

        this.cameraChanged.emit(this.cameraPosition);
    }

    private updateGameSize() {
        this.gameSizeChanged.emit(new Vector(this.gameSizeX, this.gameSizeY));
    }

    private initEventListeners() {
        this.canvas.nativeElement.addEventListener("mousemove", (event: MouseEvent) => {
            this.mousePos = this.getMousePos(this.canvas.nativeElement, event);

            if(this.mousePos.x + (this.cameraSizeX/this.gameSizeX) * this.editorCameraCanvasSize > this.editorCameraCanvasSize) {
                this.mousePos.x = Math.floor( this.editorCameraCanvasSize - ((this.cameraSizeX/this.gameSizeX) * this.editorCameraCanvasSize));
            }

            if(this.mousePos.y + (this.cameraSizeY/this.gameSizeY) * this.editorCameraCanvasSize > this.editorCameraCanvasSize) {
                this.mousePos.y = Math.floor( this.editorCameraCanvasSize - ((this.cameraSizeY/this.gameSizeY) * this.editorCameraCanvasSize));
            }

            this.updateCameraPosition(this.mousePos);
        });
    }

    private getMousePos(canvas: HTMLCanvasElement, event: MouseEvent) {
		var rect = canvas.getBoundingClientRect();
		return new Vector(event.clientX - rect.left, event.clientY - rect.top);
	}
}
