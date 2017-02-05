import { Enemy } from './enemy'
import { Context } from '../context';
import { Vector, Rectangle } from '../model';
import { TextureMapper } from '../render/textureMapper';

export class Swordman extends Enemy {

    private textureMapper = TextureMapper.getInstance();
    private collisionArea: Rectangle;

    constructor(position: Vector, width: number, height: number) {
        super(position, width, height);
        this.runningAnimation.textureNumber.push(209);
    }

}