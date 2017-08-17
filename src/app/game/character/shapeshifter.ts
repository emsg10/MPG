import { RenderCall, RenderHelper } from "../render/";
import { Animation, SpellType, Vector, Rectangle, Tile } from "../model";
import { IEnemy, Character, Player, ShapeShifterState } from "./index";
import { DeathType } from "./deathType";
import { ProjectileHandler } from "../handler/projectileHandler";
import { AnimationHandler } from "../handler/animationHandler";
import { ParticleHandler } from "../handler/particleHandler";
import { DebugHandler } from "../handler/debugHandler";
import { CollisionData } from "../collision";
import { CollisionDetection } from '../collision/collisionDetection';

export class ShapeShifter extends Character implements IEnemy {
    [x: string]: any;

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
    private hp: number = 500;
    private sorcererAnimation: Animation;
    private moveTimer = 0;
    private up = true;

    private renderHalper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();

    constructor(public position: Vector, public width: number, public height: number, private projectileHandler: ProjectileHandler, private animationHandler: AnimationHandler, private particleHandler: ParticleHandler) {
        super(position, width, height);
        this.sorcererAnimation = new Animation([600, 601, 602, 603, 604, 605, 606, 607]);
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



}