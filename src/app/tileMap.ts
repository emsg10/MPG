import { Tile } from '../model';
import { Context } from './';

export class TileMap {
	private width: number;
	private height: number;
	private tiles: Tile[][] = [];
	private textureCoordBuffer: WebGLBuffer;
	private vertexBuffer: WebGLBuffer;
	private verticesIndeciesBuffer: WebGLBuffer;

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
	}

	public render(context: Context) {
		var positionLocation = context.gl.getAttribLocation(context.shaderProgram, "a_position");
		context.gl.enableVertexAttribArray(positionLocation);
		var resolutionLocation = context.gl.getUniformLocation(context.shaderProgram, "u_resolution");
		var colorLocation = context.gl.getUniformLocation(context.shaderProgram, "u_color");
		var textureCoordAttribute = context.gl.getAttribLocation(context.shaderProgram, "a_texture_coord");
		context.gl.enableVertexAttribArray(textureCoordAttribute);
		context.gl.uniform1i(context.gl.getUniformLocation(context.shaderProgram, "u_sampler"), 0);

		var vertecies: number[] = [];
		var indecies: number[] = [];
		var textureCoordinates: number[] = [];

		for(var i = 0; i < this.tiles.length; i++) {
			for(var j = 0; j < this.tiles[i].length; j++) {
				vertecies = this.createVerteciesBuffer(this.tiles[i][j].x, this.tiles[i][j].y, this.tiles[i][j].width, this.tiles[i][j].height, vertecies);
				indecies = this.createIndecies(indecies);
				textureCoordinates = this.createTextureCoordinates(textureCoordinates);
			}
		}


		this.setRectangle(vertecies, indecies, textureCoordinates, context.gl, textureCoordAttribute);

		context.gl.bindBuffer(context.gl.ARRAY_BUFFER, this.vertexBuffer);
		context.gl.vertexAttribPointer(positionLocation, 2, context.gl.FLOAT, false, 0, 0);
		context.gl.uniform2f(resolutionLocation, this.width, this.height);

		context.gl.bindBuffer(context.gl.ARRAY_BUFFER, this.textureCoordBuffer);
		context.gl.vertexAttribPointer(textureCoordAttribute, 2, context.gl.FLOAT, false, 0, 0);

		context.gl.activeTexture(context.gl.TEXTURE0);
		context.gl.bindTexture(context.gl.TEXTURE_2D, context.texture);
		context.gl.uniform1i(context.gl.getUniformLocation(context.shaderProgram, "u_sampler"), 0);

		context.gl.bindBuffer(context.gl.ELEMENT_ARRAY_BUFFER, this.verticesIndeciesBuffer);
		context.gl.drawElements(context.gl.TRIANGLES, indecies.length, context.gl.UNSIGNED_SHORT, 0)

	}

	private setRectangle(vertecies: number[], indecies: number[], textureCoordinates: number[], gl: WebGLRenderingContext, textureCoordAttribute: number) {
  		
  		this.vertexBuffer = gl.createBuffer();
  		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

  		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertecies), gl.STATIC_DRAW);
     

     	this.textureCoordBuffer = gl.createBuffer();
  		gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);

  		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  		this.verticesIndeciesBuffer = gl.createBuffer();
  		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.verticesIndeciesBuffer);

  		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indecies), gl.STATIC_DRAW);

	}

	private createVerteciesBuffer(x: number, y: number, width: number, height:number, currentVertecies: number[]) {
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

	private createIndecies(currentIndecies: number[]) {

		var vertexIndices = [
    		currentIndecies.length,  currentIndecies.length + 1,  currentIndecies.length + 2, currentIndecies.length + 3,  currentIndecies.length + 4,  currentIndecies.length + 5
  		];

		currentIndecies.push.apply(currentIndecies, vertexIndices);

     	return currentIndecies;
	}

	private createTextureCoordinates(currentTextureCoordinates: number[]) {
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

	private randomInt(range: number) {
	  return Math.floor(Math.random() * range);
	}
}