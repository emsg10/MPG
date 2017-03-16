import { Rectangle, Tile, Vector } from '../model';

export class Grid {

    public grid: Rectangle[][][] = [];
    private gridSize: number;
    private maxX: number;
    private maxY: number;

    constructor(size: number, canvasSize: Vector) {
        this.gridSize = size;
        this.maxX = canvasSize.x/this.gridSize;
        this.maxY = canvasSize.y/this.gridSize;

        for(let i = 0; i < this.maxX; i++)  {
            this.grid[i] = [];
            for(let j = 0; j < this.maxY; j++) {
                this.grid[i][j] = [];
            }
        }
    }

    public insert(rect: Rectangle) {
        
        let coords = this.getGridCoordinates(rect);

        for(let i = 0; i < coords[2]; i++) {
            for(let j = 0; j < coords[3]; j++) {
                this.grid[coords[0] + i][coords[1] + j].push(rect);
            }
        }
    }

    public get(rect: Rectangle) {
        let result: Rectangle[] = []

        let coords = this.getGridCoordinates(rect);

        for(let i = 0; i < coords[2]; i++) {
            for(let j = 0; j < coords[3]; j++) {
                result.push(...this.grid[coords[0] + i][coords[1] + j]);
            }
        }

        return result;
    }

    private getGridCoordinates(rect: Rectangle) {

        let x = Math.floor(rect.x/this.gridSize);
        let y = Math.floor(rect.y/this.gridSize);
        let xi = Math.ceil(rect.width/this.gridSize) + 1;
        let yi = Math.ceil(rect.height/this.gridSize) + 1;

        if(x < 0) {
            x = 0;
        }

        if(y < 0) {
            y = 0;
        }

        if(x+xi > this.maxX) {
            xi = this.maxX - x ;
        }

        if(y+yi > this.maxY) {
            yi = this.maxY - y;
        }

        return [x, y, xi, yi];
    }

}