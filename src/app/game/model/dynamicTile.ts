import { Tile, Vector } from './';

export class DynamicTile {
	public tile: Tile;
	public velocity: Vector;
	private inverse: boolean = false;
	private verticalAxis: boolean;
	private distance: number = 0;
	private maxDistance: number;

	private initialPosition: Vector;

	constructor(tile: Tile, velocity: Vector, verticalAxis: boolean, maxDistance: number) {
		this.tile = tile;
		this.velocity = velocity;
		this.verticalAxis = verticalAxis;
		this.maxDistance = maxDistance;

		this.initialPosition = new Vector(tile.x, tile.y);
	}

	update(delta: number, travelDistance: number) {
		if (this.verticalAxis) {
			this.calculateVerticalMovement(delta, travelDistance);
		} else {
			this.calculateHorizontalMovement(delta, travelDistance);
		}
	}

	private calculateVerticalMovement(delta: number, travelDistance: number) {
		this.distance += Math.abs(travelDistance);

		if (this.distance >= this.maxDistance) {
			this.distance = this.maxDistance;
			if(this.inverse) {
				this.tile.y = this.initialPosition.y;
			} else {
				this.tile.y = this.initialPosition.y + this.maxDistance;
			}
			this.turn();
		} else {
			this.tile.y += travelDistance;
		}
	}

	private calculateHorizontalMovement(delta: number, travelDistance: number) {
		this.distance += Math.abs(travelDistance);

		if (this.distance >= this.maxDistance) {
			this.distance = this.maxDistance;
			if(this.inverse) {
				this.tile.x = this.initialPosition.x;
			} else {
				this.tile.x = this.initialPosition.x + this.maxDistance;
			}
			this.turn();
		} else {
			this.tile.x += travelDistance;
		}
	}

	private turn() {
		this.distance = 0;
		this.inverse = !this.inverse;
		this.velocity.invert();
	}
}