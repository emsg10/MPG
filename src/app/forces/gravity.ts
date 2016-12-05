import { Vector } from '../../model';

export class Gravity {
	constructor() {
	}

	public apply(vector: Vector) {
		vector.y += 0.5;
	}
}