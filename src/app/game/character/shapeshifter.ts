import { RenderCall, RenderHelper } from "../render/";
import { Animation, SpellType, Vector, Rectangle, Tile, ProjectileType } from "../model";
import { IEnemy, Character, Player, ShapeShifterState } from "./index";
import { DeathType } from "./deathType";
import { ProjectileHandler } from "../handler/projectileHandler";
import { AnimationHandler } from "../handler/animationHandler";
import { ParticleHandler } from "../handler/particleHandler";
import { DebugHandler } from "../handler/debugHandler";
import { CollisionData } from "../collision";
import { CollisionDetection } from '../collision/collisionDetection';

export class ShapeShifter extends Character implements IEnemy {
    public toMove: Vector;
    public dead: boolean;
    public burnValue: number = 0;
    public currentAnimation: Animation;
    public deathType: DeathType;
    public inverse: boolean;
    public color = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    public collisionData: CollisionData;
    protected velocity: Vector;
    protected gravityStrength: number = 0;
    private currentState = ShapeShifterState.Idle;
    private collisionArea: Rectangle;
    private hp: number = 1500;
    private sorcererAnimation: Animation;
    private sorcererAnimationP2: Animation;
    private sorcererAnimationP3: Animation;
    private moveTimer = 0;
    private up = true;
    private ammunition = 10;
    private elevated = false;
    private leveledYCorrds: number;
    private leveled = false;
    private elevateTime = 0;
    private projectileVelocity = 0.5;
    private p1FireCd = 1000;
    private p2FireCd = 2000;
    private p3FireCd = 1000;
    private p2BurstCd = 70;
    private fireSingle = false;
    private p2BeamCd = 300;
    private p2Beam2Cd = 1500;
    private burstTimer = 0;
    private burstTimer2 = 0;
    private fireCdTimer = 0;
    private patrolTimer = 0;
    private patrolMax = 5000;
    private direction = true;
    private currentSpell = 0;
    private freezeDamage: number = 0.08;
    private burnDamage = 0.2;
    private cinderValue = 0;
    private burnDurationFactor = 1;
    private flameDamage: number = 0.12;

    private renderHalper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();

    private onBlackFireUpdate = (area: Rectangle, inverse: boolean, offsetX: number) => {
        this.particleHandler.createBlueFireBall(new Vector(area.x, area.y), area.width, inverse, offsetX);
    };

    private onNecroUpdate = (area: Rectangle, inverse: boolean, offsetX: number) => {
        this.particleHandler.createNecroFireBall(new Vector(area.x, area.y), area.width, inverse, offsetX);
    };

    constructor(public position: Vector, public width: number, public height: number, private projectileHandler: ProjectileHandler, private animationHandler: AnimationHandler, private particleHandler: ParticleHandler) {
        super(position, width, height);
        this.sorcererAnimation = new Animation([600, 601, 602, 603, 604, 605, 606, 607]);
        this.sorcererAnimationP2 = new Animation([608, 609, 610, 611, 612, 613, 614, 615]);
        this.sorcererAnimationP3 = new Animation([616, 617, 618, 619, 620, 621, 622, 623]);
        this.currentAnimation = this.sorcererAnimation;
        this.collisionArea = new Rectangle(0, 0, this.width - 64, this.height - 40);
        this.velocity = new Vector(0, 0);
        this.toMove = new Vector(0, 0);
    }

    public getCollisionArea(): Rectangle {
        return this.collisionArea;
    }

    public takeDamage(damage: number, type: SpellType): void {
        this.hp = this.hp - damage;
        if (this.hp <= 0) {
            if (type == SpellType.frostBlast) {
                this.deathType = DeathType.freezeDeath;
            } else if (type == SpellType.fireBlast) {
                this.deathType = DeathType.fireDeath;
            } else {
                this.deathType = DeathType.swordDeath;
            }

            this.dead = true;
        }

        if (this.hp < 1000 && this.currentState == ShapeShifterState.Phase1) {
            this.currentState = ShapeShifterState.Phase1To2;
        } else if (this.hp < 500 && this.currentState == ShapeShifterState.Phase2) {
            this.currentState = ShapeShifterState.Phase2To3;
        }
    }

    public freeze(): void {
        this.takeDamage(this.freezeDamage, SpellType.frostBlast);
    }

    public burn() {
        this.cinderValue += this.burnDurationFactor;
        this.takeDamage(this.flameDamage, SpellType.fireBlast);

        if (this.cinderValue > 300) {
            this.burnValue += this.burnDurationFactor;
        }
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        this.currentAnimation.next(delta);
        this.toMove.x = this.velocity.x * delta;
        this.toMove.y = this.velocity.y * delta;
        this.collisionArea.x = this.position.x + 32;
        this.collisionArea.y = this.position.y + 40;

        this.collisionData = this.collisionDetection.collisionDetection(tiles, [], this, this.toMove, delta);

        switch (this.currentState) {

            case ShapeShifterState.Idle: this.idle(delta, player);
                break;

            case ShapeShifterState.Phase1: this.phase1(delta, player);
                break;

            case ShapeShifterState.Phase1To2: this.phase1To2();
                break;

            case ShapeShifterState.Phase2: this.phase2(delta, player);
                break;

            case ShapeShifterState.Phase2To3: this.phase2To3();
                break;

            case ShapeShifterState.Phase3: this.phase3(delta, player);
                break;
        }

        this.updateBurnDamage();
    }

    public createRenderCall(rendercall: RenderCall) {

    }

    public fall(delta: number) {
    }

    private updateBurnDamage() {
        if (this.burnValue > 0) {
            this.takeDamage(this.burnDamage, SpellType.fireBlast);
            this.burnValue--;
        }
    }

    private idle(delta: number, player: Player) {
        this.move(delta, 500, 0.0005, 0.01);

        if (Math.abs(this.position.x - player.position.x) < 400) {
            this.currentState = ShapeShifterState.Phase1;
        }
    }

    private phase1(delta: number, player: Player) {
        this.turnToPlayer(player);

        if (!this.elevated) {
            this.velocity.y = -0.2;
            this.elevateTime += delta;

            if (this.elevateTime > 700) {
                this.leveledYCorrds = this.position.y;
                this.elevated = true;
                this.elevateTime = 0;
                this.velocity.y = 0;
            } else {

            }
        } else {
            this.move(delta, 500, 0.0005, 0.1);
            this.patrol(delta);
            this.fireCdTimer += delta;
            if (this.fireCdTimer > this.p1FireCd) {
                this.p1Fire(player);
                this.fireCdTimer = 0;
            } else {
                this.particleHandler.createBlueChannelMagic(this.position, this.inverse, 105, 75, 20, 75);
            }
        }
    }

    private phase1To2() {
        this.currentAnimation = this.sorcererAnimationP2;

        this.currentState = ShapeShifterState.Phase2;
    }

    private phase2To3() {
        this.currentAnimation = this.sorcererAnimationP3;
        this.currentState = ShapeShifterState.Phase3;
    }

    private phase3(delta: number, player: Player) {
        this.velocity.x = 0;
        this.turnToPlayer(player);

        if (!this.leveled) {
            this.velocity.y = 0;
            if (this.position.y < this.leveledYCorrds) {
                this.velocity.y = 0.2;
            } else {
                this.velocity.y = -0.2;
            }

            if (this.position.y < this.leveledYCorrds && (this.position.y + 5) > this.leveledYCorrds) {
                this.leveled = true;
                this.moveReset();
                this.velocity.y = 0.1;
            }
        } else {
            this.patrol(delta);
            this.move(delta, 1500, 0.003, 0.1);
        }

        this.fireMixedP3(delta, player);
    }

    private phase2(delta: number, player: Player) {
        this.velocity.x = 0;
        this.turnToPlayer(player);
        this.move(delta, 500, 0.0005, 0.05);
        this.fireMixed(delta, player);
    }

    private fireMixedP3(delta: number, player: Player) {
        this.fireCdTimer += delta;
        this.burstTimer += delta;
        this.burstTimer2 += delta;

        if (this.fireCdTimer > this.p3FireCd) {
            this.currentSpell = Math.floor(this.rand(0, 3.99));
            this.fireCdTimer = 0;
            this.burstTimer = 0;
            this.burstTimer2 = 0;
            this.fireSingle = false;
        }

        switch (this.currentSpell) {
            case 0: this.hail(player, 140, 15, 5, 15);
                break;

            case 1: this.beam(player, 130, 35, 0, 35);
                break;

            case 2: this.necroBall(player, 50, 0, 65, 0);
                break;

            case 3: this.hail2(player, 65, 35, 80, 35);
                break;
        }
    }

    private fireMixed(delta: number, player: Player) {
        this.fireCdTimer += delta;
        this.burstTimer += delta;
        this.burstTimer2 += delta;

        if (this.fireCdTimer > this.p2FireCd) {
            this.currentSpell = Math.floor(this.rand(0, 3.99));
            this.fireCdTimer = 0;
            this.burstTimer = 0;
            this.burstTimer2 = 0;
            this.fireSingle = false;
        }

        switch (this.currentSpell) {
            case 0: this.hail(player, 150, 30, 10, 30);
                break;

            case 1: this.beam(player, 140, 70, 0, 70);
                break;

            case 2: this.necroBall(player, 40, 20, 70, 20);
                break;

            case 3: this.hail2(player, 30, 50, 110, 50);
                break;
        }
    }

    private necroBall(player: Player, offsetX: number, offsetY: number, inverseOffsetX: number, inverseOffsetY: number) {
        if (!this.fireSingle) {
            this.fireSingle = true;
            this.p2FireBall(player, offsetX, offsetY, inverseOffsetX, inverseOffsetY);
        };
    }

    private p2FireBall(player: Player, offsetX: number, offsetY: number, inverseOffsetX: number, inverseOffsetY: number) {
        let velocity = this.getProjectileVelocity(player, 50, 70);
        let pos = this.getPos(offsetX, offsetY, inverseOffsetX, inverseOffsetY);

        this.projectileHandler.createNecroBall(pos, 50, this.inverse, velocity, 100, -40, ProjectileType.NecroBall, this.onNecroUpdate);
    }

    private hail2(player: Player, offsetX: number, offsetY: number, inverseOffsetX: number, inverseOffsetY: number) {
        if (this.burstTimer < this.p2BurstCd) {
            this.p2Fire2(player, offsetX, offsetY, inverseOffsetX, inverseOffsetY);
        };
    }

    private hail(player: Player, offsetX: number, offsetY: number, inverseOffsetX: number, inverseOffsetY: number) {
        if (this.burstTimer < this.p2BurstCd) {
            this.p2Fire(player, offsetX, offsetY, inverseOffsetX, inverseOffsetY);
        };
    }

    private p2FireBeam(player: Player, offsetX: number, offsetY: number, inverseOffsetX: number, inverseOffsetY: number) {
        let velocity = this.getProjectileVelocity(player, 50, 120);
        let pos = this.getPos(offsetX, offsetY, inverseOffsetX, inverseOffsetY);

        this.projectileHandler.createNecroBall(pos, 30, this.inverse, velocity, 25, -40, ProjectileType.BlueBall, this.onBlackFireUpdate);
    }

    private p2Fire(player: Player, offsetX: number, offsetY: number, inverseOffsetX: number, inverseOffsetY: number) {
        let velocity = this.getProjectileVelocity(player, 0, 100);
        let pos = this.getPos(offsetX, offsetY, inverseOffsetX, inverseOffsetY);

        this.projectileHandler.createNecroBall(pos, 10, this.inverse, velocity, 10, -40, ProjectileType.BlueBall, this.onBlackFireUpdate);
    }

    private p2Fire2(player: Player, offsetX: number, offsetY: number, inverseOffsetX: number, inverseOffsetY: number) {
        let velocity = this.getProjectileVelocity(player, 0, 100);
        let pos = this.getPos(offsetX, offsetY, inverseOffsetX, inverseOffsetY);

        this.projectileHandler.createNecroBall(pos, 20, this.inverse, velocity, 15, -40, ProjectileType.NecroBall, this.onNecroUpdate);
    }

    private beam(player: Player, offsetX: number, offsetY: number, inverseOffsetX: number, inverseOffsetY: number) {
        if (this.burstTimer > this.p2BeamCd) {
            this.burstTimer = 0;
            this.p2FireBeam(player, offsetX, offsetY, inverseOffsetX, inverseOffsetY);
        };
    }

    private patrol(delta: number) {
        this.patrolTimer += delta;
        if (this.patrolTimer > this.patrolMax) {
            this.direction = !this.direction;
            this.patrolTimer = 0;
        }

        if (this.direction) {
            this.velocity.x = 0.1;
        } else {
            this.velocity.x = -0.1;
        }
    }

    private getProjectileVelocity(player: Player, startSpread: number, endSpread: number) {
        let velocity = this.getDeltaPosition(player, 0, this.rand(startSpread, endSpread));
        velocity.y = velocity.y + 20;
        velocity.normalize();
        velocity.multiply(this.projectileVelocity);

        return velocity;
    }

    private getPos(offsetX: number, offsetY: number, inverseOffsetX: number, inverseOffsetY: number) {
        let pos: Vector
        if (this.inverse) {
            pos = new Vector(this.position.x + inverseOffsetX, this.position.y + inverseOffsetY);
        } else {
            pos = new Vector(this.position.x + offsetX, this.position.y + offsetY);
        }

        return pos;
    }

    private p1Fire(player: Player) {

        let velocity = this.getProjectileVelocity(player, 0, 100);
        let pos = this.getPos(120, 40, -10, 40);

        this.projectileHandler.createNecroBall(pos, 60, this.inverse, velocity, 50, -40, ProjectileType.BlueBall, this.onBlackFireUpdate);
    }

    private rand(min: number, max: number) {
        return min + (Math.random() * (max - min))
    }

    private turnToPlayer(player: Player) {
        let deltaX = this.position.x - player.position.x;

        if (deltaX > 0) {
            this.inverse = true;
        } else {
            this.inverse = false;
        }
    }

    private moveReset() {
        this.moveTimer = 0;
        this.up = true;
    }

    private move(delta: number, amount: number, aceleration: number, smother: number) {

        this.moveTimer += delta;
        if (this.moveTimer > amount) {
            this.moveTimer = 0;
            if (this.up) {
                this.velocity.y = -smother;
            } else {
                this.velocity.y = smother;
            }
            this.up = !this.up;
        }

        if (this.up) {
            this.velocity.y -= aceleration;
        } else {
            this.velocity.y += aceleration;
        }
    }

    protected getDeltaPosition(player: Player, offsetX: number, offsetY: number) {
        if (this.inverse) {
            return new Vector(player.middlePosition.x - offsetX - this.position.x, player.middlePosition.y - offsetY - this.position.y);
        } else {
            return new Vector(player.middlePosition.x - offsetX - (this.position.x + this.width), player.middlePosition.y - offsetY - this.position.y);
        }

    }

}