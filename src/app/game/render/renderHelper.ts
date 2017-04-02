import { TextureMapper } from './textureMapper';
import { Vector, Rectangle } from '../model';
import { Matrix3 } from './matrix3';

export class RenderHelper {

	private static instance: RenderHelper = new RenderHelper();
	private textureMapper = TextureMapper.getInstance();
	private static textureSize = 2048;
	private canvasWidth = 1200;
	private canvasHeight = 800;
	private projectionMatrix = Matrix3.createProjectionMatrix(this.canvasWidth, this.canvasHeight);

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

		let relativePosition = new Vector(0, 0);
		relativePosition.x = x / (this.canvasWidth / 2) - 1;
		relativePosition.y = -y / (this.canvasHeight / 2) + 1;

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

		let x1 = x + width;
		let x2 = x;
		let y1 = y;
		let y2 = y + height;

		let newVertecies = [
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

	public getColor(currentColors: number[], color?: number[]) {

		let col: number[] = [];

		if (color) {
			col = color;
		} else {
			col = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
		}

		currentColors.push.apply(currentColors, col);

		return currentColors;
	}

	public getMatrices(x: number, y: number, width: number, height: number, angle: number, currentMatrices: number[]) {

		let rotationPointX = x + width / 2;
		let rotationPointY = y + height / 2;

		let moveToRotationPointMatrix = Matrix3.createTranslationMatrix(-rotationPointX, -rotationPointY);
		let rotationMatrix = Matrix3.createRotationMatrix(angle);
		let moveBackMatrix = Matrix3.createTranslationMatrix(rotationPointX, rotationPointY);

		let matrix = Matrix3.multiply(moveToRotationPointMatrix, rotationMatrix);
		matrix = Matrix3.multiply(matrix, moveBackMatrix);
		matrix = Matrix3.multiply(matrix, this.projectionMatrix);

		matrix = this.getIndeciesAttribute(matrix);

		currentMatrices.push.apply(currentMatrices, matrix);

		return currentMatrices;
	}

	public getIndeciesAttribute(attribute: number[]) {

		let copy = attribute.slice(0, attribute.length);

		for (let i = 0; i < 5; i++) {
			attribute.push(...copy);
		}

		return attribute;
	}

	public getIndecies(currentIndecies: number[]) {

		var vertexIndices = [
			currentIndecies.length, currentIndecies.length + 1, currentIndecies.length + 2, currentIndecies.length + 3, currentIndecies.length + 4, currentIndecies.length + 5
		];

		currentIndecies.push.apply(currentIndecies, vertexIndices);

		return currentIndecies;
	}

	public addTextureCoordinates(currentTextureCoordinates: number[], textureCoords: number[]) {
		currentTextureCoordinates.push.apply(currentTextureCoordinates, textureCoords);

		return currentTextureCoordinates;
	}

	public getTextureCoordinates(currentTextureCoordinates: number[], textureType: number) {

		var rect = this.textureMapper.mapTexture(textureType);

		let textureCoordinates = this.getCoords(rect, RenderHelper.textureSize);

		currentTextureCoordinates.push.apply(currentTextureCoordinates, textureCoordinates);

		return currentTextureCoordinates;
	}

	private getCoords(rect: Rectangle, size: number) {
		let x1 = rect.x / size;
		let y1 = rect.y / size;
		let x2 = (rect.x + rect.width) / size;
		let y2 = (rect.y + rect.height) / size;

		var textureCoordinates = [
			x1, y1,
			x2, y2,
			x2, y1,
			x1, y1,
			x2, y2,
			x1, y2
		];

		return textureCoordinates;
	}

}