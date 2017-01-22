import { TextureMapper } from './textureMapper';

export class RenderHelper {

  private static instance: RenderHelper = new RenderHelper();
  private textureMapper: TextureMapper = new TextureMapper();

  constrcuctor() {
		if(RenderHelper.instance) {
			throw new Error("Static class cant be instanced!");
		}

		RenderHelper.instance = this;
	}

	public static getInstance() {
		return RenderHelper.instance;
	}

  public getVertecies(x: number, y: number, width: number, height:number, currentVertecies: number[]) {

		var x1 = x;
  		var x2 = x + width;
  		var y1 = y;
  		var y2 = y + height;

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

	public getIndecies(currentIndecies: number[]) {

		var vertexIndices = [
    		currentIndecies.length,  currentIndecies.length + 1,  currentIndecies.length + 2, currentIndecies.length + 3,  currentIndecies.length + 4,  currentIndecies.length + 5
  		];

		currentIndecies.push.apply(currentIndecies, vertexIndices);

     	return currentIndecies;
	}

	public getTextureCoordinates(currentTextureCoordinates: number[], textureType: number) {
		
		var rect = this.textureMapper.mapTexture(textureType);

		let x1: number = rect.x/512;
		let y1: number = rect.y/512;
    	let x2 = (rect.x + rect.width)/512;
    	let y2 = (rect.y + rect.height)/512;

		var textureCoordinates = [
			x1,  y1,
		  x2,  y2,
		  x2,  y1,
		  x1,  y1,
		  x2,  y2,
		  x1,  y2
		];

		currentTextureCoordinates.push.apply(currentTextureCoordinates, textureCoordinates);

     	return currentTextureCoordinates;
	}

}