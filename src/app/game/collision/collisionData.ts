export class CollisionData {
	normalX: number = 0;
	normalY: number = 0;
	collisionTimeY: number = 1;
	collisionTimeX: number = 1;
	remainingTime: number = 0;
	wallCollision: boolean = false;
	groundCollision: boolean = false;
	fallDeath: boolean = false;
}