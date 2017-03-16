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

    public gameSizeX: string = "1200";
    public gameSizeY: string = "800";
    public context: Context;

    private renderer: Renderer;

    constructor() {
        
    }

    public init(asset: Asset) {
        this.context = new Context(asset, 256, 256, this.canvas.nativeElement);
    }
}
