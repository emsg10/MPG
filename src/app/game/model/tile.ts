export class Tile
{
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	public tileTextureType: number;

	constructor(x: number, y: number, width: number, height: number, textureType: number){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.tileTextureType = textureType;
	}

}