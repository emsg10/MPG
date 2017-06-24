import {
    Projectile,
    Vector,
    Rectangle,
    SpellType,
    Spell,
    PhysicalProjectile,
    Meele,
    Animation,
    DebugElement,
    StickyAnimation,
    RotationAnimation,
    CollisionProjectile,
    ProjectileType,
    ParticleProjectile,
    DynamicTile
} from '../model';
import { Player } from '../character/player';
import { AnimationHandler } from './animationHandler';
import { ParticleHandler } from './particleHandler';
import { EnemyHandler } from './enemyHandler';
import { DebugHandler } from './debugHandler';
import { Gravity } from '../forces/gravity';
import { Drag } from '../forces/drag';
import { CollisionDetection } from '../collision/collisionDetection';
import { CollisionData } from '../collision/collisionData';
import { Enemy } from '../character/enemy';

export class ProjectileHandler {

    public projectiles: Projectile[] = [];
    private enemyProjectiles: Projectile[] = [];
    private animationHandler: AnimationHandler;
    private collisionDetection = CollisionDetection.getInstance();
    private debuggHandler = DebugHandler.getInstance();

    constructor(animationHandler: AnimationHandler) {
        this.animationHandler = animationHandler;
    }

    public clear() {
        this.projectiles = [];
        this.enemyProjectiles = [];
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

    public createArrow(position: Vector, inverse: boolean, velocity: Vector) {
        let arrow: PhysicalProjectile;
        let rectangle = new Rectangle(position.x, position.y, 40, 10);
        let collRect: Rectangle;

        if (inverse) {
            collRect = new Rectangle(position.x + 10, position.y + 5, 1, 1);
        } else {
            collRect = new Rectangle(position.x + 20, position.y + 5, 1, 1);
        }

        let animation = this.animationHandler.createArrow(rectangle, inverse, velocity);
        arrow = new PhysicalProjectile(velocity, rectangle, animation, 1, collRect, true);
        arrow.gravity = new Gravity(0.0003);
        arrow.drag = new Drag(0);

        arrow.projectileType = ProjectileType.Arrow;

        this.enemyProjectiles.push(arrow);

        return arrow;
    }

    public createDeadArrow(position: Vector, inverse: boolean, velocity: Vector, push?: Vector) {
        let arrow: PhysicalProjectile;
        let rectangle = new Rectangle(position.x, position.y, 40, 10);
        let collRect: Rectangle;

        if (inverse) {
            collRect = new Rectangle(position.x + 10, position.y + 5, 1, 1);
        } else {
            collRect = new Rectangle(position.x + 20, position.y + 5, 1, 1);
        }

        let animation = this.animationHandler.createDeadArrow(rectangle, inverse, velocity);
        velocity.x = -velocity.x/2;
        if (push) {
            velocity.x += push.x;
            velocity.y += push.y;
        }
        arrow = new PhysicalProjectile(velocity, rectangle, animation, 1, collRect);
        arrow.gravity = new Gravity(0.0006);
        arrow.drag = new Drag(0.0002);

        arrow.projectileType = ProjectileType.None;

        this.projectiles.push(arrow);

        return arrow;
    }

    public createFireBall(position: Vector, inverse: boolean, velocityValue: number, strength: number, offset: number, onUpdate: (area: Rectangle, inverse: boolean, offsetX: number) => void) {

        let fireBall: ParticleProjectile;

        if (inverse) {
            fireBall = new ParticleProjectile(new Vector(-velocityValue, 0), new Rectangle(position.x, position.y, strength, strength), this.animationHandler.voidAnimation(), 0.2, (strength * 10), inverse, offset, onUpdate);
        } else {
            fireBall = new ParticleProjectile(new Vector(velocityValue, 0), new Rectangle(position.x, position.y, strength, strength), this.animationHandler.voidAnimation(), 0.2, (strength * 10), inverse, offset, onUpdate);
        }

        this.projectiles.push(fireBall);
    }

    public createCollisionProjectile(position: Vector, offset: number, inverse: boolean, damage: number, velocity: Vector) {
        let rect: Rectangle;
        if (inverse) {
            rect = new Rectangle(position.x, position.y - 10, 10, 10);
            velocity.x = -velocity.x;
        } else {
            rect = new Rectangle(position.x + offset, position.y - 10, 10, 10);
        }
        let collisionProjectile = new CollisionProjectile(velocity, rect, 40, this.animationHandler.voidAnimation(), damage);
        collisionProjectile.projectileType = ProjectileType.Sword;

        this.enemyProjectiles.push(collisionProjectile);

        return collisionProjectile;
    }

    public createSwordman_death(position: Vector, inverse: boolean, velocity: Vector) {
        let projectile: PhysicalProjectile;

        projectile = new PhysicalProjectile(velocity, new Rectangle(position.x, position.y, 28, 29), this.animationHandler.swordman_head(position, inverse), 0.3)
        projectile.extendedOnGroundCollision = () => {
            let currentFrame = projectile.animation.getCurrentFrame();
            projectile.animation.textureNumber = [currentFrame];
            projectile.animation.frameIndex = 0;
        }
        this.animationHandler.bloodAnimation_C(new Vector(position.x - 10, position.y - 20), 75);
        this.animationHandler.bloodAnimation_B_Left(new Vector(position.x - 10, position.y - 20), 75);
        this.animationHandler.bloodAnimation_B_Right(new Vector(position.x - 10, position.y - 20), 75);
        this.animationHandler.swordman_death(position, inverse);
        this.animationHandler.swordman_corpse(position, inverse);

        this.projectiles.push(projectile);
    }

    public createPlayerSword_death(position: Vector, inverse: boolean) {

        let projectile: PhysicalProjectile;
        let projectileCorpse: Projectile;
        let velocity = new Vector(0, 0);
        let x = position.x;

        if (inverse) {
            x -= 45;
        }

        projectile = new PhysicalProjectile(velocity, new Rectangle(x, position.y - 6, 45, 85), this.animationHandler.player_sword_death_animation(position, inverse), 1)

        projectileCorpse = new PhysicalProjectile(velocity, new Rectangle(x, position.y - 6, 45, 85), this.animationHandler.player_sword_death_corpse(position, inverse), 1)
        if (inverse) {
            this.animationHandler.bloodAnimation_B_Left(new Vector(position.x - 10, position.y - 20), 75);
        } else {
            this.animationHandler.bloodAnimation_B_Right(new Vector(position.x - 10, position.y - 20), 75);
        }

        this.projectiles.push(projectile);
        this.projectiles.push(projectileCorpse);
    }

    public createShadow_death(area: Rectangle, inverse: boolean) {

        let projectile: PhysicalProjectile;
        let projectileCorpse: Projectile;
        let velocity = new Vector(0, 0);
        let x = area.x;

        

        projectile = new PhysicalProjectile(velocity, new Rectangle(x, area.y - 10, area.width, area.height), this.animationHandler.shadow_Death(area, inverse), 0.8)

        this.projectiles.push(projectile);
    }

    public createFrozenSwordManDeath(area: Rectangle, inverse: boolean, color: number[]) {

        let onComplete = () => {

            let velocotyies = [
                new Vector((Math.random() * 0.15), (-Math.random() * 0.3)),
                new Vector((Math.random() * 0.15), (-Math.random() * 0.3)),
                new Vector((Math.random() * 0.15), (-Math.random() * 0.3)),
                new Vector((-Math.random() * 0.15), (-Math.random() * 0.3)),
                new Vector((-Math.random() * 0.15), (-Math.random() * 0.3)),
                new Vector((-Math.random() * 0.15), (-Math.random() * 0.3)),
            ];

            let collisionAreas = [
                new Rectangle(area.x + 7, area.y + 22, 11, 8),
                new Rectangle(area.x + 12, area.y + 5, 12, 12),
                new Rectangle(area.x + 15, area.y + 24, 14, 6),
                new Rectangle(area.x + 13, area.y + 38, 6, 8),
                new Rectangle(area.x + 6, area.y + 38, 8, 10),
                new Rectangle(area.x + 4, area.y + 11, 13, 16)
            ];

            for (let i = 0; i < 6; i++) {
                this.createFrozenPart(velocotyies[i], area, inverse, color, i, 243, collisionAreas[i]);
            }
        };

        this.animationHandler.frozenSwordMan(area, inverse, color, onComplete);
    }

    public createFrozenArcherDeath(area: Rectangle, inverse: boolean, color: number[]) {

        let onComplete = () => {

            let velocotyies = [
                new Vector((Math.random() * 0.15), (-Math.random() * 0.3)),
                new Vector((Math.random() * 0.15), (-Math.random() * 0.3)),
                new Vector((Math.random() * 0.15), (-Math.random() * 0.3)),
                new Vector((-Math.random() * 0.15), (-Math.random() * 0.3)),
                new Vector((-Math.random() * 0.15), (-Math.random() * 0.3)),
                new Vector((-Math.random() * 0.15), (-Math.random() * 0.3)),
            ];

            let collisionAreas = [
                new Rectangle(area.x + 8, area.y + 2, 11, 6),
                new Rectangle(area.x + 4, area.y + 4, 9, 14),
                new Rectangle(area.x + 17, area.y + 3, 11, 11),
                new Rectangle(area.x + 13, area.y + 7, 15, 15),
                new Rectangle(area.x + 5, area.y + 15, 13, 17),
                new Rectangle(area.x + 14, area.y + 19, 13, 13)
            ];

            for (let i = 0; i < 6; i++) {
                this.createFrozenPart(velocotyies[i], area, inverse, color, i, 276, collisionAreas[i]);
            }
        };

        this.animationHandler.frozenArcher(area, inverse, color, onComplete);
    }

    public update(delta: number, collidables: Rectangle[], player: Player, dynamicTiles: DynamicTile[]) {
        let removeProjectile: Projectile[] = [];
        let removeEnemyProjectile: Projectile[] = [];

        removeProjectile = this.updateFriendslyProjectiles(delta, collidables);
        removeEnemyProjectile = this.updateEnemyProjectiles(delta, player, collidables, dynamicTiles);

        for (let projectile of removeProjectile) {
            this.destroyProjectile(projectile, this.projectiles);
        }

        for (let projectile of removeEnemyProjectile) {
            this.destroyProjectile(projectile, this.enemyProjectiles);
        }
    }

    public destroyProjectile(projectile: Projectile, projectiles: Projectile[]) {
        this.destroyAnimation(projectile);
        this.animationHandler.remove(projectile.animation);
        let index = projectiles.indexOf(projectile);
        if (index != -1) {
            projectiles.splice(index, 1);
        }
    }

    public calculateDirection(area: Rectangle, enemy: Enemy) {
        let velocity = new Vector((enemy.position.x + enemy.width / 2) - (area.x + (area.width / 2)), enemy.position.y - (area.y + (area.height / 2)))
        velocity.normalize();
        velocity.multiply((area.width / 90));

        return velocity;
    }

    private updateEnemyProjectiles(delta: number, player: Player, collidables: Rectangle[], dynamicTiles: DynamicTile[]) {
        let removeProjectiles: Projectile[] = [];
        let shieldCollidables: Rectangle[] = [];
        let playerCollisionArea = player.getProjectileCollisionArea();

        shieldCollidables.push(...player.getShieldCollidables());

        for (let projectile of this.enemyProjectiles) {
            let frameVelocity = new Vector(projectile.velocity.x * delta, projectile.velocity.y * delta);
            removeProjectiles = this.updateAndCollCheckEnemyProjectile(projectile, frameVelocity, delta, player, dynamicTiles, playerCollisionArea, shieldCollidables, removeProjectiles);
            removeProjectiles = this.checkStaticObjectCollisions(projectile, frameVelocity, collidables, removeProjectiles);
        }

        return removeProjectiles;
    }

    private updateAndCollCheckEnemyProjectile(projectile: Projectile, frameVelocity: Vector, delta: number, player: Player, dynamicTiles: DynamicTile[], playerCollisionArea: Rectangle, shieldCollidables: Rectangle[], removeProjectiles: Projectile[]) {
        let collisionData: CollisionData;
        let shieldCollisionData: CollisionData;
        let dynamicCollisionData: CollisionData = new CollisionData();
        let groundCollision: boolean;
        let dynamicGroundCollision: boolean;
        let liftVelocity: Vector;
        projectile.updateForces(delta);

        let velocity = player.getVelocity();
        let deltaVelocity = new Vector(frameVelocity.x - velocity.x * delta, frameVelocity.y - velocity.y * delta);

        collisionData = this.collisionDetection.checkProjectileCollisionY([playerCollisionArea], projectile, deltaVelocity, false);
        shieldCollisionData = this.collisionDetection.checkProjectileCollisionY(shieldCollidables, projectile, deltaVelocity, false);

        for (let dynamicTile of dynamicTiles) {
            let deltaVelocity = new Vector(frameVelocity.x - dynamicTile.velocity.x * delta, frameVelocity.y - dynamicTile.velocity.y * delta);
            let colData = this.collisionDetection.checkProjectileCollisionY([dynamicTile.tile], projectile, deltaVelocity, false);

            if (colData.collisionTimeY < dynamicCollisionData.collisionTimeY) {
                dynamicCollisionData = colData;
                liftVelocity = dynamicTile.velocity;
            }
        }

        projectile.update(0, collisionData.collisionTimeY * frameVelocity.y, delta);

        dynamicGroundCollision = dynamicCollisionData.groundCollision;
        groundCollision = shieldCollisionData.groundCollision;

        if (shieldCollisionData.groundCollision) {
            this.setShieldDamage(player, projectile);
            removeProjectiles.push(projectile);
        } else if (dynamicCollisionData.groundCollision) {
            this.createDeadArrow(new Vector(projectile.area.x, projectile.area.y), projectile.animation.inverse, projectile.velocity, liftVelocity);
            removeProjectiles.push(projectile);
        } else if (collisionData.groundCollision) {
            this.animationHandler.bloodAnimation_A(new Vector(projectile.collisionArea.x, projectile.collisionArea.y), 20);
            this.setDamageAnimation(player, projectile);
            removeProjectiles.push(projectile);
        }

        if (projectile.projectileType == ProjectileType.Arrow) {
            collisionData = this.collisionDetection.checkProjectileCollisionX([playerCollisionArea], projectile, deltaVelocity, false, false);
            shieldCollisionData = this.collisionDetection.checkProjectileCollisionX(shieldCollidables, projectile, deltaVelocity, false, false);
            for (let dynamicTile of dynamicTiles) {
                let deltaVelocity = new Vector(frameVelocity.x - dynamicTile.velocity.x * delta, frameVelocity.y - dynamicTile.velocity.y * delta);
                let colData = this.collisionDetection.checkProjectileCollisionX([dynamicTile.tile], projectile, deltaVelocity, false, false);

                if (colData.collisionTimeX < dynamicCollisionData.collisionTimeX) {
                    dynamicCollisionData = colData;
                    liftVelocity = dynamicTile.velocity;
                }
            }
        } else {
            collisionData = this.collisionDetection.checkProjectileCollisionX([playerCollisionArea], projectile, deltaVelocity, false, true);
            shieldCollisionData = this.collisionDetection.checkProjectileCollisionX(shieldCollidables, projectile, deltaVelocity, false, true);
        }

        projectile.update(collisionData.collisionTimeX * frameVelocity.x, 0, delta);

        if (!groundCollision || !dynamicGroundCollision) {
            if (shieldCollisionData.wallCollision) {
                this.setShieldDamage(player, projectile);
                removeProjectiles.push(projectile);
            } else if (dynamicCollisionData.wallCollision) {
                this.createDeadArrow(new Vector(projectile.area.x, projectile.area.y), projectile.animation.inverse, projectile.velocity, liftVelocity);
                removeProjectiles.push(projectile);
            } else if (collisionData.wallCollision) {
                this.animationHandler.bloodAnimation_A(new Vector(projectile.area.x, projectile.area.y), 20);
                this.setDamageAnimation(player, projectile);
                removeProjectiles.push(projectile);
            }
        }

        if (projectile instanceof CollisionProjectile) {
            if (projectile.distance <= 0) {
                removeProjectiles.push(projectile);
            }
        }

        return removeProjectiles;
    }

    private setDamageAnimation(player: Player, projectile: Projectile) {
        if (projectile.projectileType == ProjectileType.Arrow) {
            this.createStickyArrowAnimation(player, projectile);
            player.takeDamage(20);
        } else if (projectile.projectileType == ProjectileType.Sword && projectile instanceof CollisionProjectile) {
            player.takeDamage(projectile.damage);
        }
    }

    private checkStaticObjectCollisions(projectile: Projectile, frameVelocity: Vector, collidables: Rectangle[], removeProjectiles: Projectile[]) {
        let collisionData: CollisionData;

        collisionData = this.collisionDetection.checkProjectileCollisionY(collidables, projectile, frameVelocity, true);

        if (collisionData.groundCollision) {
            this.setStaticObjectAnimation(projectile);
            removeProjectiles.push(projectile);
        } else {
            collisionData = this.collisionDetection.checkProjectileCollisionX(collidables, projectile, frameVelocity, true, false);

            if (collisionData.wallCollision) {
                this.setStaticObjectAnimation(projectile);
                removeProjectiles.push(projectile);
            }
        }

        return removeProjectiles;

    }

    private createStickyArrowAnimation(player: Player, projectile: Projectile) {
        if (projectile.projectileType == ProjectileType.Arrow) {
            let animationOffset: Vector;
            animationOffset = new Vector((player.position.x) - (projectile.area.x), player.position.y - projectile.area.y);
            player.damageAnimations.push(new StickyAnimation(this.animationHandler.createArrowHit(projectile, true), animationOffset));
        }
    }

    private setStaticObjectAnimation(projectile: Projectile) {
        if (projectile.projectileType == ProjectileType.Arrow) {
            this.animationHandler.createArrowHit(projectile, false);
        }
    }

    private updateAndCollCheck(projectile: Projectile, delta: number, collidables: Rectangle[], removeProjectiles: Projectile[]) {
        let collisionData: CollisionData;

        projectile.updateForces(delta);

        let frameVelocity = new Vector(projectile.velocity.x * delta, projectile.velocity.y * delta);
        collisionData = this.collisionDetection.checkProjectileCollisionY(collidables, projectile, frameVelocity, true);
        projectile.update(0, collisionData.collisionTimeY * frameVelocity.y, delta);

        if (projectile instanceof PhysicalProjectile) {
            if (collisionData.groundCollision) {
                projectile.onGroundCollision();
            }
        }

        if (collisionData.groundCollision) {
            projectile.velocity.y = 0;
        }

        collisionData = this.collisionDetection.checkProjectileCollisionX(collidables, projectile, frameVelocity, true, false);
        projectile.update(collisionData.collisionTimeX * frameVelocity.x, 0, delta);

        if (projectile instanceof Spell || projectile instanceof ParticleProjectile) {
            if (projectile.distance <= 0 || collisionData.wallCollision) {
                removeProjectiles.push(projectile);
            }
        }

        if (collisionData.wallCollision) {
            projectile.velocity.x = 0;
        }

        return removeProjectiles;
    }

    private updateFriendslyProjectiles(delta: number, collidables: Rectangle[]) {
        let collisionData: CollisionData;
        let removeProjectiles: Projectile[] = [];

        for (let projectile of this.projectiles) {
            this.updateAndCollCheck(projectile, delta, collidables, removeProjectiles);
        }

        return removeProjectiles;
    }

    private setShieldDamage(player: Player, projectile: Projectile) {
        if (projectile.projectileType == ProjectileType.Arrow) {
            this.createDeadArrow(new Vector(projectile.area.x, projectile.area.y), projectile.animation.inverse, projectile.velocity);
            if (!player.useMana(20)) {
                if(projectile.area.x > player.position.x) {
                    player.shieldExplosion(false);
                } else {
                    player.shieldExplosion(true);
                }
                player.mana = 0;
                
            }
        } else if (projectile.projectileType == ProjectileType.Sword && projectile instanceof CollisionProjectile) {
            if (!player.useMana(projectile.damage)) {
                player.mana = 0;
                if(projectile.area.x > player.position.x) {
                    player.shieldExplosion(true);
                } else {
                    player.shieldExplosion(false);
                }
            };
        }
    }

    private destroyAnimation(projectile: Projectile) {
        if (projectile instanceof ParticleProjectile) {
            this.animationHandler.fireball_explosion(new Vector(projectile.area.x, projectile.area.y), projectile.area.width);
        }
    }

    private createFrozenPart(velocity: Vector, rect: Rectangle, inverse: boolean, color: number[], partIndex: number, baseNumber: number, collisionArea: Rectangle) {
        let projectile: Projectile;

        projectile = new PhysicalProjectile(velocity, new Rectangle(rect.x, rect.y, rect.width, rect.width), this.animationHandler.frozenPart(rect, inverse, color, partIndex, baseNumber), 1, collisionArea)

        this.projectiles.push(projectile);
    }
}