import { Projectile, Vector, Rectangle, SpellType, Spell, PhysicalProjectile } from '../model';
import { AnimationHandler } from './animationHandler';
import { EnemyHandler } from './enemyHandler';
import { CollisionDetection } from '../collision/collisionDetection';
import { CollisionData } from '../collision/collisionData';
import { Enemy } from '../character/enemy';

export class ProjectileHandler {

    private projectiles: Projectile[] = [];
    private animationHandler: AnimationHandler;
    private enemyHandler: EnemyHandler;
    private collisionDetection = CollisionDetection.getInstance();

    constructor(animationHandler: AnimationHandler, enemyHandler: EnemyHandler) {
        this.animationHandler = animationHandler;
        this.enemyHandler = enemyHandler;
    }

    public createBolt(position: Vector, size: number, inverse: boolean, type: SpellType) {
        let spell: Spell;

        if (inverse) {
            spell = new Spell(new Vector(-0.6, 0), new Rectangle(position.x, position.y, size, size), this.animationHandler.createSpellAnimation(new Vector(position.x, position.y), size, inverse, type), 0.2, (size * 10), type);
        } else {
            spell = new Spell(new Vector(0.6, 0), new Rectangle(position.x, position.y, size, size), this.animationHandler.createSpellAnimation(new Vector(position.x, position.y), size, inverse, type), 0.2, (size * 10), type);
        }

        this.projectiles.push(spell);
    }

    public createSwordman_death(position: Vector, inverse: boolean, velocity: Vector) {
        let projectile: Projectile;

        projectile = new PhysicalProjectile(velocity, new Rectangle(position.x, position.y, 28, 29), this.animationHandler.swordman_head(position, inverse), 0.3)
        this.animationHandler.bloodAnimation_C(new Vector(position.x - 10, position.y - 20), 75);
        this.animationHandler.bloodAnimation_B_Left(new Vector(position.x - 10, position.y - 20), 75);
        this.animationHandler.bloodAnimation_B_Right(new Vector(position.x - 10, position.y - 20), 75);
        this.animationHandler.swordman_death(position, inverse);
        this.animationHandler.swordman_corpse(position, inverse);

        this.projectiles.push(projectile);
    }

    public update(delta: number, collidables: Rectangle[]) {
        let removeProjectile: Projectile[] = [];
        let collisionData: CollisionData;

        for (let projectile of this.projectiles) {

            let frameVelocity = new Vector(projectile.velocity.x * delta, projectile.velocity.y * delta);
            collisionData = this.collisionDetection.checkProjectileCollisionY(collidables, projectile, frameVelocity);
            projectile.update(0, collisionData.collisionTimeY * frameVelocity.y, delta);

            if(projectile instanceof PhysicalProjectile) {
                if(collisionData.groundCollision) {
                    let currentFrame = projectile.animation.getCurrentFrame();
                    projectile.animation.textureNumber = [currentFrame];
                    projectile.animation.frameIndex = 0;
                }
            }

            if (collisionData.groundCollision) {
                projectile.velocity.y = 0;
            }

            collisionData = this.collisionDetection.checkProjectileCollisionX(collidables, projectile, frameVelocity);
            projectile.update(collisionData.collisionTimeX * frameVelocity.x, 0, delta);

            if (projectile instanceof Spell) {
                if (projectile.distance <= 0 || collisionData.wallCollision) {
                    removeProjectile.push(projectile);
                }
            }

            if (collisionData.wallCollision) {
                projectile.velocity.x = 0;
            }

        }

        for (let projectile of removeProjectile) {
            this.destroyProjectile(projectile);
        }

        this.enemyCollisionCheck(delta);
    }

    private destroyProjectile(projectile: Projectile) {
        this.destroyAnimation(projectile);
        this.animationHandler.animations.splice(this.animationHandler.animations.indexOf(projectile.animation), 1);
        this.projectiles.splice(this.projectiles.indexOf(projectile), 1);
    }

    private destroyAnimation(projectile: Projectile) {
        if (projectile instanceof Spell) {
            if (projectile.type == SpellType.electricbolt) {
                this.animationHandler.sizzle(new Vector(projectile.area.x, projectile.area.y), projectile.area.width);
            } else {
                this.animationHandler.fireball_destroy(new Vector(projectile.area.x, projectile.area.y), projectile.area.width);
            }
        }
    }

    private enemyCollisionCheck(delta: number) {
        for (let projectile of this.projectiles) {

            if (projectile instanceof Spell) {

                let removeEnemy: Enemy[] = [];

                for (let enemy of this.enemyHandler.enemies) {
                    let velocityDelta = new Vector((projectile.velocity.x * delta) - (enemy.toMove.x), (projectile.velocity.y * delta) - (enemy.toMove.y));

                    let collisionData = this.collisionDetection.checkProjectileCollisionX([new Rectangle(enemy.position.x + (enemy.width / 2) - ((enemy.width * 0.5) / 2), enemy.position.y, enemy.width * 0.5, enemy.height)], projectile, velocityDelta);

                    if (collisionData.wallCollision) {
                        this.destroyProjectile(projectile);
                        this.createSwordman_death(enemy.position, enemy.inverse, this.calculateDirection(projectile, enemy));
                        removeEnemy.push(enemy);
                    }
                }

                for(let enemy of removeEnemy) {
                    this.enemyHandler.remove(enemy);
                }
            }
        }
    }

    private calculateDirection(projectile: Projectile, enemy: Enemy) {
        let velocity = new Vector((enemy.position.x + enemy.width/2) - (projectile.area.x + (projectile.area.width/2)), enemy.position.y - (projectile.area.y + (projectile.area.height/2)))
        velocity.normalize();
        velocity.multiply((projectile.area.width/75));

        return velocity;
    }
}