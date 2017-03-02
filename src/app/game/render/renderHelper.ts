import { TextureMapper } from './textureMapper';
import { Vector } from '../model';

export class RenderHelper {

	private static instance: RenderHelper = new RenderHelper();
	private textureMapper = TextureMapper.getInstance();
	private static textureSize = 2048;
	private canvasWidth = 1200;
	private canvasHeight = 800;

	constrcuctor() {
		if (RenderHelper.instance) {
			throw new Error("Static class cant be instanced!");
		}

		RenderHelper.instance = this;
	}

	public static getInstance() {
		return RenderHelper.instance;
	}

	public getRelativeValue(x: number, y: number) {

		let relativePosition = new Vector(0,0);
		relativePosition.x = x/(this.canvasWidth/2) - 1;
		relativePosition.y = -y/(this.canvasHeight/2) + 1;

		return relativePosition;
	}

	public getVertecies(x: number, y: number, width: number, height: number, currentVertecies: number[]) {

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

	public getInverseVertecies(x: number, y: number, width: number, height: number, currentVertecies: number[]) {
		var x1 = x + width;
		var x2 = x;
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

	getColor(currentColors: number[], color?: number[]) {
		
		let col: number[] = [];

		if(color) {
			col = color;
		} else {
			col = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
		}

		currentColors.push.apply(currentColors, col);

		return currentColors;
	}

	public getIndecies(currentIndecies: number[]) {

		var vertexIndices = [
			currentIndecies.length, currentIndecies.length + 1, currentIndecies.length + 2, currentIndecies.length + 3, currentIndecies.length + 4, currentIndecies.length + 5
		];

		currentIndecies.push.apply(currentIndecies, vertexIndices);

		return currentIndecies;
	}

	public getTextureCoordinates(currentTextureCoordinates: number[], textureType: number) {

		var rect = this.textureMapper.mapTexture(textureType);

		let x1: number = rect.x / RenderHelper.textureSize;
		let y1: number = rect.y / RenderHelper.textureSize;
		let x2 = (rect.x + rect.width) / RenderHelper.textureSize;
		let y2 = (rect.y + rect.height) / RenderHelper.textureSize;

		var textureCoordinates = [
			x1, y1,
			x2, y2,
			x2, y1,
			x1, y1,
			x2, y2,
			x1, y2
		];

		currentTextureCoordinates.push.apply(currentTextureCoordinates, textureCoordinates);

		return currentTextureCoordinates;
	}

}