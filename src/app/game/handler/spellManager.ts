import { SpellType } from "../model";
import { AnimationHandler } from './animationHandler';
import { ProjectileHandler } from './projectileHandler';
import { ParticleHandler } from './particleHandler';

export class SpellManager {

    private animationHandler: AnimationHandler;
    private projectileHandler: ProjectileHandler;
    private particleHandler: ParticleHandler;

    constructor(animationHandler: AnimationHandler, projectileHandler: ProjectileHandler, particleHandler: ParticleHandler) {
        this.animationHandler = animationHandler;
        this.projectileHandler = projectileHandler;
        this.particleHandler = particleHandler;
    }

    public update(delta: number) {

    }

    public cast(spellType: SpellType) {
        switch(spellType) {
            case SpellType.fireball: this.castFireBall();
            break;

            case SpellType.electricbolt: this.castElectricBall();
            break;

            case SpellType.fireBlast: this.castFireBlast();
            break;

            case SpellType.frostBlast: this.castFrostBlast();
            break;

            case SpellType.shield: this.castShield();
            break;
        }
    }

    private castFireBall() {

    }

    private castElectricBall() {

    }

    private castFireBlast() {

    }

    private castFrostBlast() {

    }

    private castShield() {

    }



}