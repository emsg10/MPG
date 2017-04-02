import { Enemy } from './enemy';
import { Player } from './player';
import { Context } from '../context';
import { Vector, Rectangle, Tile, Meele, Animation, SpellType, DebugElement } from '../model';
import { TextureMapper } from '../render/textureMapper';
import { AnimationHandler } from '../handler/animationHandler';
import { ProjectileHandler } from '../handler/projectileHandler';
import { DebugHandler } from '../handler/debugHandler';
import { DeathType } from './deathType';

export class Archer extends Enemy {

    private textureMapper = TextureMapper.getInstance();
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler;
    protected hitAreaOffset: number = 600;
    protected searchAreaOffset: number = 800;
    private arrowVelocity = 0.5;
    private shoot = false;
    public debugHandler = DebugHandler.getInstance();

    constructor(position: Vector, width: number, height: number, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler) {
        super(position, width, height);
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;

        this.maxSpeed = 0.1;
        this.actualSpeed = this.maxSpeed;

        this.runningAnimation.textureNumber.push(267);
        this.runningAnimation.textureNumber.push(266);
        this.runningAnimation.textureNumber.push(267);
        this.runningAnimation.textureNumber.push(265);

        this.hitAnimation.textureNumber.push(262);
        this.hitAnimation.textureNumber.push(263);
        this.hitAnimation.textureNumber.push(264);

        this.trackingAnimation.textureNumber.push(267);

        this.hitAnimation.timeToChange = 300;

        this.currentAnimation = this.hitAnimation;

        this.runningAnimation.timeToChange = 175;

        this.currentAnimation = this.runningAnimation;
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        super.update(delta, tiles, player);

        this.currentAnimation.next(delta);

        this.npcAction(delta, player, tiles);
    }

    public getCollisionArea() {
        let collisionArea = new Rectangle(this.position.x + 10, this.position.y - 5, this.width - 20, 55);

        return collisionArea;
    }

    protected hit(player: Player) {
        
        if(this.hitAnimation.frameIndex == 2) {
            if(!this.shoot) {
                this.shoot = true;
                let velocity = this.calculatePath(player, this.inverse);
                let bowPosition = new Vector(this.position.x, this.position.y + 20); 
                this.projectileHandler.createArrow(bowPosition, this.inverse, velocity);
            }
        } else {
            this.shoot = false;
        }
    }

    protected inRange(player: Player, offset: number, tiles: Tile[]) {

        let deltaPos = this.getDeltaPosition(player);
        let magnitude = deltaPos.magnitude();

        if(magnitude < this.searchAreaOffset) {
            return true;
        } else {
            return false;
        }
    }

    protected startTracking() {
        this.tracking = true;
    }

    private getDeltaPosition(player: Player) {
        return new Vector(player.position.x - this.position.x, player.position.y - this.position.y);
    }
    
    private getDeltaVelocity(player: Player, deltaPos: Vector) {
        
        let deltaVelocity = player.velocity.x * player.velocity.x * 500;
        if(deltaPos.x < 0) {
            if(player.velocity.x > 0) {
                return -deltaVelocity;
            } else {
                return deltaVelocity;
            }
        } else {
            if(player.velocity.x > 0) {
                return deltaVelocity;
            } else {
                return -deltaVelocity;
            }
        }
        
    }

    private calculatePath(player: Player, inverse: boolean) {
        let deltaPos = this.getDeltaPosition(player);

        deltaPos.y = deltaPos.y - ((deltaPos.x * deltaPos.x * 0.0007) + this.getDeltaVelocity(player, deltaPos));
        
        let velocity = new Vector(deltaPos.x, deltaPos.y * this.rand(0.85, 1.15));
        velocity.normalize();
        velocity.multiply(this.arrowVelocity);
        return velocity;
    }

}