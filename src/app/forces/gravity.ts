import { Vector } from '../../model';

export class Gravity {
	private strength = 0;

	constructor(strength: number) {
		this.strength = strength;
	}

	public apply(vector: Vector, delta: number) {
		vector.y += this.strength * delta;
	}
}