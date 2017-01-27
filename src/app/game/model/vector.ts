export class Vector {

	public x:number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public add(vector: Vector) {
		this.x += vector.x;
		this.y += vector.y;

		return this;
	}

	public copy(vector: Vector) {
		return new Vector(vector.x, vector.y);
	}
}