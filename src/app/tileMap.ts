import { Tile, Vector } from '../model';
import { RenderCall } from './render/renderCall';
import { TextureMapper } from './render/textureMapper';
import { Context } from './';

export class TileMap {
	public renderCall: RenderCall = new RenderCall();
	public tiles: Tile[][] = [];
	private textureMapper = new TextureMapper();
	private context: Context;

	constructor() {
	}

	public create(context: Context, tiles: Tile[][]) {
		this.tiles = tiles;
		this.context = context;

		this.createRenderCall(this.tiles);
	}

	public createRenderCall(tiles: Tile[][]) {
		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];

		for(var i = 0; i < this.tiles.length; i++) {
			for(var j = 0; j < this.tiles[i].length; j++) {
				if(this.tiles[i][j].tileTextureType != 0) {
					vertecies = this.getVertecies(this.tiles[i][j].x, this.tiles[i][j].y, this.tiles[i][j].width, this.tiles[i][j].height, vertecies);
					textureCoords = this.getTextureCoordinates(textureCoords, this.tiles[i][j].tileTextureType);
					indecies = this.getIndecies(indecies);
				}
			}
		}

		this.renderCall.vertecies = vertecies;
		this.renderCall.textureCoords = textureCoords;
		this.renderCall.indecies = indecies;
		this.renderCall.context = this.context;

		return this.renderCall;
	}

	private getVertecies(x: number, y: number, width: number, height:number, currentVertecies: number[]) {

		var x1 = x - (width / 2);
  		var x2 = x + (width / 2);
  		var y1 = y - (height / 2);
  		var y2 = y + (height / 2);

  		var newVertecies = [
     		x1, y1,
     		x2, y2,
     		x2, y1,
     		x1, y1,
     		x2, y2,
     		x1, y2
     		]

     	currentVertecies.push.apply(currentVertecies, newVertecies);

     	return currentVertecies;
	}

	private getIndecies(currentIndecies: number[]) {

		var vertexIndices = [
    		currentIndecies.length,  currentIndecies.length + 1,  currentIndecies.length + 2, currentIndecies.length + 3,  currentIndecies.length + 4,  currentIndecies.length + 5
  		];

		currentIndecies.push.apply(currentIndecies, vertexIndices);

     	return currentIndecies;
	}

	private getTextureCoordinates(currentTextureCoordinates: number[], textureType: number) {
		
		var point = this.textureMapper.mapTexture(textureType);

		let x: number = point.x;
		let y: number = point.y;

		var textureCoordinates = [
			(0.1 * x),  (0.1 * y),
		    (0.1 * (x + 1)),  (0.1 * (y + 1)),
		    (0.1 * (x + 1)),  (0.1 * y),
		    (0.1 * x),  (0.1 * y),
		    (0.1 * (x + 1)),  (0.1 * (y + 1)),
		    (0.1 * x),  (0.1 * (y + 1)),
		];

		currentTextureCoordinates.push.apply(currentTextureCoordinates, textureCoordinates);

     	return currentTextureCoordinates;
	}
}