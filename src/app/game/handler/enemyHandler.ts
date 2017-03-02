import { Tile, Spell, Vector, Rectangle } from '../model';
import { Enemy } from '../character/enemy';
import { Player } from '../character/player';
import { Swordman } from '../character/swordman';
import { RenderCall, RenderHelper } from '../render';
import { Context } from '../context';
import { ProjectileHandler } from './projectileHandler';
import { AnimationHandler } from './animationHandler';
import { CollisionDetection } from '../collision/collisionDetection';
import { DeathType } from '../character/deathType';

export class EnemyHandler {

    public enemies: Enemy[] = [];

    private context: Context;
    private renderHelper = RenderHelper.getInstance();
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler
    private collisionDetection = CollisionDetection.getInstance();

    constructor(context: Context, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler) {
        this.context = context;
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        for(let enemy of this.enemies) {
            enemy.update(delta, tiles, player);
            this.enemyCollisionCheck(delta);
            this.checkEnemyDeath(enemy);
        }
    }

    createRenderCall(renderCall: RenderCall) {

		for(let enemy of this.enemies) {
            if(enemy.inverse) {
                renderCall.vertecies = this.renderHelper.getInverseVertecies(enemy.position.x, enemy.position.y, enemy.width, enemy.height, renderCall.vertecies);
            } else {
                renderCall.vertecies = this.renderHelper.getVertecies(enemy.position.x, enemy.position.y, enemy.width, enemy.height, renderCall.vertecies);
            }
            renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, enemy.currentAnimation.getCurrentFrame());
			renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
            renderCall.color = this.renderHelper.getColor(renderCall.color, enemy.color);
		}

		return renderCall;
    }

    remove(enemy: Enemy) {
        let index = this.enemies.indexOf(enemy);
        if(index >= 0) {
            this.enemies.splice(index, 1);
        }
    }

    private checkEnemyDeath(enemy: Enemy) {
        if(enemy.dead) {
            if(enemy.deathType == DeathType.freezeDeath) {
                this.projectileHandler.createSwordman_death(enemy.position, enemy.inverse, this.projectileHandler.calculateDirection(enemy.getCollisionArea(), enemy));
                this.remove(enemy);
            }
        }
    }

    private enemyCollisionCheck(delta: number) {
        for (let projectile of this.projectileHandler.projectiles) {

            if (projectile instanceof Spell) {

                let removeEnemy: Enemy[] = [];

                for (let enemy of this.enemies) {
                    let velocityDelta = new Vector((projectile.velocity.x * delta) - (enemy.toMove.x), (projectile.velocity.y * delta) - (enemy.toMove.y));

                    let collisionData = this.collisionDetection.checkProjectileCollisionX([new Rectangle(enemy.position.x + (enemy.width / 2) - ((enemy.width * 0.5) / 2), enemy.position.y, enemy.width * 0.5, enemy.height)], projectile, velocityDelta);

                    if (collisionData.wallCollision) {

                        enemy.takeDamage(projectile.area.width, projectile.type)
                        if(enemy.inverse) {     
                            this.animationHandler.bloodAnimation_B_Right(new Vector(enemy.position.x + 10, enemy.position.y - 20), 75);
                        } else {
                            this.animationHandler.bloodAnimation_B_Left(new Vector(enemy.position.x - 10, enemy.position.y - 20), 75);
                        }
                        
                        this.projectileHandler.destroyProjectile(projectile, this.projectileHandler.projectiles);

                        if(enemy.dead) {
                            this.projectileHandler.createSwordman_death(enemy.position, enemy.inverse, this.projectileHandler.calculateDirection(projectile.area, enemy));
                            removeEnemy.push(enemy);
                        }
                    }
                }

                for(let enemy of removeEnemy) {
                    this.remove(enemy);
                }
            }
        }
    }

}