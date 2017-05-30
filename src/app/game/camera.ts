import { Vector } from './model';

export class Camera {
    private cameraOffset: [number, number] = [800, 500];

    private maxX: number;
    private maxXCameraPosition: number;

    private maxY: number;
    private maxYCameraPosition: number;

    constructor(public position: [number, number], public sceneSize: [number, number], private gameSize: [number, number]) {
        this.position = position;
        this.sceneSize = sceneSize;
        
        this.maxX = 100 + (this.sceneSize[0] - this.cameraOffset[0]);
        this.maxXCameraPosition = this.gameSize[0] - (this.maxX + this.cameraOffset[0] - 100);

        this.maxY = (this.sceneSize[1] - this.cameraOffset[1]);
        this.maxYCameraPosition = this.gameSize[1] - (this.maxY + this.cameraOffset[1]);
    }

    public update(focusPosition: Vector) {

        if(focusPosition.x - this.position[0] > this.cameraOffset[0] - 100) {
            this.position[0] = focusPosition.x - this.cameraOffset[0] + 100;
            
            if((focusPosition.x + this.maxX) > this.gameSize[0]) {
                this.position[0] = this.maxXCameraPosition;
            }
        } else if(focusPosition.x - this.position[0] < this.sceneSize[0] - this.cameraOffset[0]) {
            this.position[0] = focusPosition.x - (this.sceneSize[0] - this.cameraOffset[0]);
            if(this.position[0] < 0) {
                this.position[0] = 0;
            }
        }

        if(focusPosition.y - this.position[1] > this.cameraOffset[1]) {
            this.position[1] = focusPosition.y - this.cameraOffset[1];

            if((focusPosition.y + this.maxY) > this.gameSize[1]) {
                this.position[1] = this.maxYCameraPosition;
            }

        } else if(focusPosition.y - this.position[1] < this.sceneSize[1] - this.cameraOffset[1]) {
            this.position[1] = focusPosition.y - (this.sceneSize[1] - this.cameraOffset[1]);

             if(this.position[1] < 0) {
                this.position[1] = 0;
            }
        }
    }
}