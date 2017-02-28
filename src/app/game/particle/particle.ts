export class Particle {

    public startPos: number[];
    public endPos: number[];
    public lifetime: number;
    public relativeTime: number;
    public elapsedMs: number;
    public dead: boolean;

    constructor(startPos: number[], endPos:  number[], lifeTime: number) {
        this.startPos = startPos;
        this.endPos = endPos;
        this.lifetime = lifeTime;
        this.relativeTime = 0;
        this.elapsedMs = 0;
        this.dead = false;
    }

}