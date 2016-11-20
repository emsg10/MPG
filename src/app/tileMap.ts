import { Tile } from '../model';
import { Context } from './';

export class TileMap {
	private width: number;
	private height: number;
	private tiles: Tile[][] = [];

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
		var resolutionLocation = context.gl.getUniformLocation(context.shaderProgram, "u_resolution");
		var colorLocation = context.gl.getUniformLocation(context.shaderProgram, "u_color");

		var buffer = context.gl.createBuffer();
		context.gl.bindBuffer(context.gl.ARRAY_BUFFER, buffer);

		for(var i = 0; i < this.tiles.length; i++) {
			for(var j = 0; j < this.tiles[i].length; j++) {
				this.setRectangle(this.tiles[i][j].x, this.tiles[i][j].y, this.tiles[i][j].width, this.tiles[i][j].height, context.gl);
				context.gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
				context.gl.enableVertexAttribArray(positionLocation);
				context.gl.uniform2f(resolutionLocation, this.width, this.height);
				context.gl.vertexAttribPointer(positionLocation, 2, context.gl.FLOAT, false, 0, 0);
				context.gl.uniform4f(colorLocation, Math.random(), Math.random(), Math.random(), 1);
				context.gl.drawArrays(context.gl.TRIANGLES, 0, 6);
			}
		}
	}

	private setRectangle(x: number, y: number, width: number, height: number, gl: WebGLRenderingContext) {
  		var x1 = x;
  		var x2 = x + width;
  		var y1 = y;
  		var y2 = y + height;
  		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     		x1, y1,
     		x2, y1,
     		x1, y2,
     		x1, y2,
     		x2, y1,
     		x2, y2]
     	), gl.STATIC_DRAW);
	}

	private randomInt(range: number) {
	  return Math.floor(Math.random() * range);
	}
}