import { Rectangle, Vector } from './'

export class Sprite {
	public position: Rectangle;
	public size: Vector;

	constructor(position: Rectangle) {
		this.position = position;
	}
}