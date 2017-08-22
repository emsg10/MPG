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
    public burnValue: number;
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
    private moveTimer = 0;
    private up = true;
    private ammunition = 10;
    private elevated = false;
    private elevateTime = 0;
    private projectileVelocity = 0.5;
    private p1FireCd = 1000;
    private p2FireCd = 1500;
    private p2BurstCd = 100;
    private burstTimer = 0;
    private fireCdTimer = 0;
    private patrolTimer = 0;
    private patrolMax = 5000;
    private direction = true;
    private currentSpell = 0;

    private renderHalper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();

    private onBlackFireUpdate = (area: Rectangle, inverse: boolean, offsetX: number) => {
        this.particleHandler.createBlueFireBall(new Vector(area.x, area.y), area.width, inverse, offsetX);
    };

    constructor(public position: Vector, public width: number, public height: number, private projectileHandler: ProjectileHandler, private animationHandler: AnimationHandler, private particleHandler: ParticleHandler) {
        super(position, width, height);
        this.sorcererAnimation = new Animation([600, 601, 602, 603, 604, 605, 606, 607]);
        this.sorcererAnimationP2 = new Animation([608, 609, 610, 611, 612, 613, 614, 615]);
        this.currentAnimation = this.sorcererAnimation;
        this.collisionArea = new Rectangle(0, 0, this.width - 10, this.height);
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

        if (this.hp < 1500) {
            this.currentState = ShapeShifterState.Phase1To2;
        }
    }

    public freeze(): void {
        throw new Error("Method not implemented.");
    }

    public burn(): void {
        throw new Error("Method not implemented.");
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        this.currentAnimation.next(delta);
        this.toMove.x = this.velocity.x * delta;
        this.toMove.y = this.velocity.y * delta;
        this.collisionArea.x = this.position.x;
        this.collisionArea.y = this.position.y;

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
        }
    }

    public createRenderCall(rendercall: RenderCall) {

    }

    public fall(delta: number) {
    }

    private idle(delta: number, player: Player) {
        this.move(delta);

        if (Math.abs(this.position.x - player.position.x) < 400) {
            this.currentState = ShapeShifterState.Phase1;
        }
    }

    private phase1(delta: number, player: Player) {
        this.turnToPlayer(player);

        this.move(delta);
        if (!this.elevated) {
            this.velocity.y = -0.2;
            this.elevateTime += delta;

            if (this.elevateTime > 600) {
                this.elevated = true;
                this.elevateTime = 0;
                this.velocity.y = 0;
            } else {

            }
        } else {
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
        this.hp = 1000;
    }

    private phase2(delta: number, player: Player) {
        this.velocity.x = 0;
        this.turnToPlayer(player);

        this.move(delta);

        this.fireCdTimer += delta;
        this.burstTimer += delta;

        if (this.fireCdTimer > this.p2FireCd) {
            this.currentSpell = Math.round(this.rand(0, 3));
            this.fireCdTimer = 0;
            this.burstTimer = 0;
        }

        switch (this.currentSpell) {
            case 0: this.hail(player);
                break;

            case 1: this.hail(player);
                break;

            case 2: this.hail(player);
                break;

            case 3: this.hail(player);
                break;
        }
    }

    private hail(player: Player) {
        if (this.burstTimer < this.p2BurstCd) {
            this.p2Fire(player);
        };
    }

    private p2Fire(player: Player) {
        let velocity = this.getProjectileVelocity(player, 100);
        let pos = this.getPos(150, 30, 10, 30);

        this.projectileHandler.createNecroBall(pos, 10, this.inverse, velocity, 10, -40, ProjectileType.BlueBall, this.onBlackFireUpdate);
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

    private getProjectileVelocity(player: Player, spread: number) {
        let velocity = this.getDeltaPosition(player, 0, this.rand(0, spread));
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

        let velocity = this.getProjectileVelocity(player, 100);
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

    private move(delta: number) {

        this.moveTimer += delta;
        if (this.moveTimer > 500) {
            this.moveTimer = 0;
            this.velocity.y = 0;
            this.up = !this.up;
        }

        if (this.up) {
            this.velocity.y -= 0.0005;
        } else {
            this.velocity.y += 0.0005;
        }
    }

    protected getDeltaPosition(player: Player, offsetX: number, offsetY: number) {
        if(this.inverse) {
            return new Vector(player.middlePosition.x - offsetX - this.position.x, player.middlePosition.y - offsetY - this.position.y);
        } else {
            return new Vector(player.middlePosition.x - offsetX - (this.position.x + this.width), player.middlePosition.y - offsetY - this.position.y);
        }
        
    }

}