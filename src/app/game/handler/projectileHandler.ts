import { Projectile, Vector, Rectangle, SpellType} from '../model';
import { AnimationHandler } from './animationHandler';
import { CollisionDetection } from '../collision/collisionDetection';

export class ProjectileHandler {
    
    private projectiles: Projectile[] = [];
    private animationHandler: AnimationHandler;
    private collisionDetection = CollisionDetection.getInstance();

    constructor(animationHandler: AnimationHandler) {
        this.animationHandler = animationHandler;
    }

    public createBolt(position: Vector, size: number, inverse: boolean, type: SpellType) {
        let projectile: Projectile;

        if(inverse) {
            projectile = new Projectile(new Vector(-0.6, 0), new Rectangle(position.x, position.y, size, size), this.animationHandler.createSpellAnimation(new Vector(position.x, position.y), size, inverse, type), (size * 10), 0.2, type);
        } else {
            projectile = new Projectile(new Vector(0.6, 0), new Rectangle(position.x, position.y, size, size), this.animationHandler.createSpellAnimation(new Vector(position.x, position.y), size, inverse, type), (size * 10), 0.2, type);
        }

        this.projectiles.push(projectile);
    }

    public update(delta: number, collidables: Rectangle[]) {
        let removeProjectile: Projectile[] = [];

        for(let projectile of this.projectiles) {

            let frameVelocity = new Vector(projectile.velocity.x * delta, projectile.velocity.y * delta);
            let collisionData = this.collisionDetection.checkProjectileCollision(collidables, projectile, frameVelocity);

            projectile.update(frameVelocity.x * collisionData.collisionTimeX, frameVelocity.y * collisionData.collisionTimeY);

            if(projectile.distance <= 0 || collisionData.wallCollision) {
                removeProjectile.push(projectile);
            }
        }

        for(let projectile of removeProjectile) {
            if(projectile.type == SpellType.electricbolt) {
                this.animationHandler.sizzle(new Vector(projectile.area.x, projectile.area.y), projectile.area.width);
            } else {
                this.animationHandler.fireball_destroy(new Vector(projectile.area.x, projectile.area.y), projectile.area.width);
            }
            
            this.animationHandler.animations.splice(this.animationHandler.animations.indexOf(projectile.animation), 1);

            this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
        }
    }
}