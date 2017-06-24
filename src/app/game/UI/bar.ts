import { Rectangle } from '../model';

export class Bar {

    constructor(
        public area: Rectangle,
        public maxWidth: number,
        public textureArea: Rectangle,
        public maxTextureWidth: number
        ) {
    }
}

export class ProgressBar {
    public bar: Bar;
    public maxValue: number;
}