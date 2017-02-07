import { Enemy } from './enemy'
import { Context } from '../context';
import { Vector, Rectangle, Tile } from '../model';
import { TextureMapper } from '../render/textureMapper';
import { AnimationHandler } from '../handler/animationHandler';

export class Swordman extends Enemy {

    private textureMapper = TextureMapper.getInstance();
    private collisionArea: Rectangle;

    constructor(position: Vector, width: number, height: number) {
        super(position, width, height);

        this.maxSpeed = 0.1;

        this.runningAnimation.textureNumber.push(209);
        this.runningAnimation.textureNumber.push(211);
        this.runningAnimation.textureNumber.push(210);
        this.runningAnimation.textureNumber.push(211);
    }

    public update(delta: number, tiles: Tile[]) {
        super.update(delta, tiles);

        this.npcAction(delta);
    }

    private npcAction(delta: number) {
        if(this.oldDirection != this.direction) {
            this.oldDirection = this.direction;
        } 

        if(this.oldDirection) {
            this.moveLeft(delta);
            
        } else {
            this.moveRight(delta);
        }
        
        
    }

}