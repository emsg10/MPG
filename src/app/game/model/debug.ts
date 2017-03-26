import { Rectangle } from './';

export class DebugElement {

    area: Rectangle;
    inverse: boolean;

    constructor(area: Rectangle, inverse: boolean) {
        this.area = area;
        this.inverse = inverse;
    }

    
}