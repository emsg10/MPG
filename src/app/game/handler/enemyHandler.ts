import { Tile, Spell, Vector, Rectangle, ParticleProjectile, SpellType } from '../model';
import { Enemy } from '../character/enemy';
import { Player } from '../character/player';
import { Swordman } from '../character/swordman';
import { Archer, Shadow, Apprentice, Screamer } from '../character/';
import { RenderCall, RenderHelper, ColorRenderCall } from '../render';
import { Context } from '../context';
import { ProjectileHandler } from './projectileHandler';
import { AnimationHandler } from './animationHandler';
import { ParticleHandler } from './particleHandler';
import { CollisionDetection } from '../collision/collisionDetection';
import { DeathType } from '../character/deathType';

export class EnemyHandler {

    public enemies: Enemy[] = [];

    private context: Context;
    private renderHelper = RenderHelper.getInstance();
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler;
    private particleHandler: ParticleHandler;
    private collisionDetection = CollisionDetection.getInstance();

    constructor(context: Context, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler, particleHandler: ParticleHandler) {
        this.context = context;
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;
        this.particleHandler = particleHandler;
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        for (let enemy of this.enemies) {
            enemy.update(delta, tiles, player);
            this.enemyCollisionCheck(delta);
            this.checkBurn(enemy);
            this.checkEnemyDeath(enemy);
        }
    }

    createRenderCall(renderCall: ColorRenderCall) {
        for (let enemy of this.enemies) {
            if (enemy.inverse) {
                renderCall.vertecies = this.renderHelper.getInverseVertecies(enemy.position.x, enemy.position.y, enemy.width, enemy.height, renderCall.vertecies);
            } else {
                renderCall.vertecies = this.renderHelper.getVertecies(enemy.position.x, enemy.position.y, enemy.width, enemy.height, renderCall.vertecies);
            }
            renderCall.textureCoords.push.apply(renderCall.textureCoords, enemy.currentAnimation.getCurrentFrame());
            renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
            renderCall.color = this.renderHelper.getColor(renderCall.color, enemy.color);
        }

        return renderCall;
    }

    remove(enemy: Enemy) {
        let index = this.enemies.indexOf(enemy);
        if (index >= 0) {
            this.enemies.splice(index, 1);
        }
    }

    private checkBurn(enemy: Enemy) {
        if (enemy.burnValue > 0) {
            let collarea = enemy.getCollisionArea();
            let pos = new Vector(collarea.x, collarea.y);
            this.particleHandler.createBurn(pos);
        }
    }

    private checkEnemyDeath(enemy: Enemy) {
        if (enemy.dead) {
            if (enemy.deathType == DeathType.freezeDeath) {
                if(enemy instanceof Swordman) {
                    this.projectileHandler.createFrozenSwordManDeath(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse, enemy.color);
                } else if (enemy instanceof Archer) {
                    this.projectileHandler.createFrozenArcherDeath(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse, enemy.color);
                } else if(enemy instanceof Shadow) {
                    this.projectileHandler.createShadow_death(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                } else if(enemy instanceof Apprentice) {
                    this.projectileHandler.createApprentice_death(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                } else if (enemy instanceof Screamer) {
                    this.projectileHandler.createScreamer_death(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                }
                
                this.remove(enemy);
            } else if (enemy.deathType == DeathType.fireDeath) {
                if(enemy instanceof Swordman) {
                    this.animationHandler.fireDeathSwordman(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                } else if (enemy instanceof Archer) {
                    this.animationHandler.fireDeathArcher(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                } else if(enemy instanceof Shadow) {
                    this.projectileHandler.createShadow_death(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                } else if(enemy instanceof Apprentice) {
                    this.projectileHandler.createApprentice_death(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                } else if (enemy instanceof Screamer) {
                    this.projectileHandler.createScreamer_death(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                }

                this.remove(enemy);
            } else if (enemy.deathType == DeathType.swordDeath) {
                if(enemy instanceof Archer) {
                    this.animationHandler.createArcherDeath(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                } else if(enemy instanceof Shadow) {
                    this.projectileHandler.createShadow_death(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                } else if(enemy instanceof Apprentice) {
                    this.projectileHandler.createApprentice_death(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                } else if (enemy instanceof Screamer) {
                    this.projectileHandler.createScreamer_death(new Rectangle(enemy.position.x, enemy.position.y, enemy.width, enemy.height), enemy.inverse);
                }

                this.remove(enemy);
            }
        }
    }

    private enemyCollisionCheck(delta: number) {
        for (let projectile of this.projectileHandler.projectiles) {

            if (projectile instanceof ParticleProjectile) {

                let removeEnemy: Enemy[] = [];

                for (let enemy of this.enemies) {

                    let velocityDelta = new Vector((projectile.velocity.x * delta) - (enemy.toMove.x), (projectile.velocity.y * delta) - (enemy.toMove.y));
                    let collisionData = this.collisionDetection.checkProjectileCollisionX([enemy.getCollisionArea()], projectile, velocityDelta, false, true);

                    if (collisionData.wallCollision) {

                        enemy.takeDamage(projectile.area.width, SpellType.fireball)
                        if (enemy.inverse) {
                            this.animationHandler.bloodAnimation_B_Right(new Vector(enemy.position.x + 10, enemy.position.y - 20), 75);
                        } else {
                            this.animationHandler.bloodAnimation_B_Left(new Vector(enemy.position.x - 10, enemy.position.y - 20), 75);
                        }

                        this.projectileHandler.destroyProjectile(projectile, this.projectileHandler.projectiles);

                        if (enemy.dead) {
                            if(enemy instanceof Swordman) {
                                this.projectileHandler.createSwordman_death(enemy.position, enemy.inverse, this.projectileHandler.calculateDirection(projectile.area, enemy));
                                removeEnemy.push(enemy);
                            }
                        }
                    }
                }

                for (let enemy of removeEnemy) {
                    this.remove(enemy);
                }
            }
        }
    }

}