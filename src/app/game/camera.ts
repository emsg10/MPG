import { Vector } from './model';

export class Camera {
    public position: Vector;
    private sceneSize: Vector;
    private cameraOffset = new Vector(800, 500);

    constructor(position: Vector, sceneSize: Vector) {
        this.position = position;
        this.sceneSize = sceneSize;
    }

    public update(focusPosition: Vector) {

        if(focusPosition.x - this.position.x > this.cameraOffset.x - 100) {
            this.position.x = focusPosition.x - this.cameraOffset.x + 100;
        } else if(focusPosition.x - this.position.x < this.sceneSize.x - this.cameraOffset.x) {
            this.position.x = focusPosition.x - (this.sceneSize.x - this.cameraOffset.x);
        }

        if(focusPosition.y - this.position.y > this.cameraOffset.y) {
            this.position.y = focusPosition.y - this.cameraOffset.y;
        } else if(focusPosition.y - this.position.y < this.sceneSize.y - this.cameraOffset.y) {
            this.position.y = focusPosition.y - (this.sceneSize.y - this.cameraOffset.y);
        }
    }
}