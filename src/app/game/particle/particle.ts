export class Particle {

    public startPos: number[];
    public endPos: number[];
    public lifetime: number;
    

    constructor(startPos: number[], endPos:  number[], lifeTime:  number) {
        this.startPos = startPos;
        this.endPos = endPos;
        this.lifetime = lifeTime;
    }

}