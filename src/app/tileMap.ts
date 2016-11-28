import { Tile } from '../model';
import { RenderCall } from './render/renderCall';

export class TileMap {
	private width: number;
	private height: number;
	private tiles: Tile[][] = [];
	public renderCall: RenderCall = new RenderCall();

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}

	public create() {
		var tileWidth = 20;
		var tileHeight = 20;

		var columnNumber = this.width / tileWidth;
		var rowNumber = this.height / tileHeight;

		for(var i = 0; i < columnNumber; i++) {
			this.tiles[i] = [];
			for(var j = 0; j < rowNumber; j++)
			{
				this.tiles[i][j] = new Tile(tileWidth * i, tileHeight * j, tileWidth, tileHeight);
			}
		}

		this.createRenderCall();
	}

	private createRenderCall() {
		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];

		for(var i = 0; i < this.tiles.length; i++) {
			for(var j = 0; j < this.tiles[i].length; j++) {
				vertecies = this.getVertecies(this.tiles[i][j].x, this.tiles[i][j].y, this.tiles[i][j].width, this.tiles[i][j].height, vertecies);
				textureCoords = this.getTextureCoordinates(textureCoords);
				indecies = this.getIndecies(indecies);
			}
		}

		this.renderCall.vertecies = vertecies;
		this.renderCall.textureCoords = textureCoords;
		this.renderCall.indecies = indecies;
		this.renderCall.width = this.width;
		this.renderCall.height = this.height;
	}

	

	private getVertecies(x: number, y: number, width: number, height:number, currentVertecies: number[]) {
		var x1 = x;
  		var x2 = x + width;
  		var y1 = y;
  		var y2 = y + height;

  		var newVertecies = [
     		x1, y1,
     		x2, y2,
     		x1, y2,
     		x1, y1,
     		x2, y2,
     		x2, y1]

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

	private getTextureCoordinates(currentTextureCoordinates: number[]) {
		var textureCoordinates = [
			0.0,  0.0,
		    1.0,  1.0,
		    0.0,  1.0,
		    0.0,  0.0,
		    1.0,  1.0,
		    1.0,  0.0
		];

		currentTextureCoordinates.push.apply(currentTextureCoordinates, textureCoordinates);

     	return currentTextureCoordinates;
	}
}