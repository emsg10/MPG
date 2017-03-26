export class Vector {

	public x:number;
	public y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	public add(vector: Vector) {
		if(vector) {
			this.x += vector.x;
			this.y += vector.y;
		}

		return this;
	}

	public copy(vector: Vector) {
		return new Vector(vector.x, vector.y);
	}

	public normalize() {
		let mag = this.magnitude();
		this.x = this.x/mag;
		this.y = this.y/mag;
	}

	public magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	public multiply(factor: number) {
		this.x = this.x * factor;
		this.y = this.y * factor;
	}
}