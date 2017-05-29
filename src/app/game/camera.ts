import { Vector } from './model';

export class Camera {
    private cameraOffset: [number, number] = [800, 500];

    constructor(public position: [number, number], public sceneSize: [number, number]) {
        this.position = position;
        this.sceneSize = sceneSize;
    }

    public update(focusPosition: Vector) {

        if(focusPosition.x - this.position[0] > this.cameraOffset[0] - 100) {
            this.position[0] = focusPosition.x - this.cameraOffset[0] + 100;
        } else if(focusPosition.x - this.position[0] < this.sceneSize[0] - this.cameraOffset[0]) {
            this.position[0] = focusPosition.x - (this.sceneSize[0] - this.cameraOffset[0]);
        }

        if(focusPosition.y - this.position[1] > this.cameraOffset[1]) {
            this.position[1] = focusPosition.y - this.cameraOffset[1];
        } else if(focusPosition.y - this.position[1] < this.sceneSize[1] - this.cameraOffset[1]) {
            this.position[1] = focusPosition.y - (this.sceneSize[1] - this.cameraOffset[1]);
        }
    }
}