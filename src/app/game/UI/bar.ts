export class Bar {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public maxWidth: number;
    public textureNumber: number;

    constructor(x: number, y: number, width: number, height: number, maxWidth: number, textureMapper: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.maxWidth = maxWidth;
        this.textureNumber = textureMapper;
    }
}

export class ProgressBar {
    public bar: Bar;
    public content: Bar;
    public maxValue: number;
}