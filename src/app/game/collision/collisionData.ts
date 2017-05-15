export class CollisionData {
	normalX: number = 0;
	normalY: number = 0;
	collisionTimeY: number = 1;
	collisionTimeX: number = 1;
	velocityY: number;
	velocityX: number;
	remainingTime: number = 0;
	wallCollision: boolean = false;
	groundCollision: boolean = false;
	liftCollision: boolean = false;
	fallDeath: boolean = false;
}