import { RenderCall, RenderHelper } from "../render/";
import { Animation, SpellType } from "../model/index";
import { IEnemy } from "./index";
import { Vector } from "../model/vector";
import { DeathType } from "./deathType";
import { Rectangle } from "../model/rectangle";
import { ProjectileHandler } from "../handler/projectileHandler";
import { AnimationHandler } from "../handler/animationHandler";
import { ParticleHandler } from "../handler/particleHandler";

export class ShapeShifter implements IEnemy {

    public toMove: Vector;
    public dead: boolean;
    public burnValue: number;
    public currentAnimation: Animation;
    public deathType: DeathType;
    public inverse: boolean;
    public color = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    private hp: number = 500;
    private sorcererAnimation: Animation;
    private renderHalper = RenderHelper.getInstance();

    constructor(public position: Vector, public width: number, public height: number, private projectileHandler: ProjectileHandler, private animationHandler: AnimationHandler, private particleHandler: ParticleHandler) {
        this.sorcererAnimation = new Animation([600, 601, 602, 603, 604, 605, 606, 607]);
        this.currentAnimation = this.sorcererAnimation;
    }

    getCollisionArea(): Rectangle {
        throw new Error("Method not implemented.");
    }

    takeDamage(damage: number, type: SpellType): void {
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

    freeze(): void {
        throw new Error("Method not implemented.");
    }

    burn(): void {
        throw new Error("Method not implemented.");
    }

    public update(delta: number) {
        this.currentAnimation.next(delta);
    }

    public createRenderCall(rendercall: RenderCall) {

    }

}