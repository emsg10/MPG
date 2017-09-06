import { SpellType, Cast, Animation, InstantCast, ChannelCast, Vector, Rectangle, SpellCast, Progress, ContinuousAudio } from '../model';
import { AnimationHandler } from './animationHandler';
import { ProjectileHandler } from './projectileHandler';
import { ParticleHandler } from './particleHandler';
import { Player } from '../character/player';
import { AudioHandler } from "./audioHandler";

export class SpellHandler {

    public currentCast: Cast;
    public shieldCollidables: Rectangle[] = [];
    public castingShield = false;

    private animationHandler: AnimationHandler;
    private projectileHandler: ProjectileHandler;
    private particleHandler: ParticleHandler;
    private player: Player;

    private fireBlastCast: InstantCast;
    private frostBlastCast: InstantCast;
    private fireBallCast: SpellCast;

    private channelMagicCast: ChannelCast;

    private break: number = 0;
    private refShieldCollidables: Rectangle[] = [];
    private maxMagicValue = 50 + (20 * this.fireLevel);
    private minMagicValue = 25 + (5 * this.fireLevel);

    private flameThrowerAudio: ContinuousAudio;
    private freezeAudio: ContinuousAudio;
    private shieldAudio: ContinuousAudio;
    private magicChannelAudio: ContinuousAudio;
    private maxMagicAudio: ContinuousAudio;


    constructor(animationHandler: AnimationHandler, projectileHandler: ProjectileHandler, particleHandler: ParticleHandler, player: Player, private fireLevel: number, private frostLevel: number, private shieldLevel: number) {
        this.animationHandler = animationHandler;
        this.projectileHandler = projectileHandler;
        this.particleHandler = particleHandler;
        this.player = player;

        this.createShieldCollidables();

        this.initCasts();

        this.flameThrowerAudio = this.animationHandler.audioHandler.createContinuos("flamethrower.ogg", 3.5, 0, 0.1);
        this.freezeAudio = this.animationHandler.audioHandler.createContinuos("freeze.ogg", 6, 0, 0.1);
        this.shieldAudio = this.animationHandler.audioHandler.createContinuos("shield.ogg", 2.4, 0, 0.03);
        this.magicChannelAudio = this.animationHandler.audioHandler.createContinuos("fireloop.ogg", 1, 0, 0.02);
        this.maxMagicAudio = this.animationHandler.audioHandler.createContinuos("fireloop.ogg", 2.5, 1, 0.01);   
    }

    public update(delta: number) {

        if (this.currentCast && this.break == 0) {
            this.currentCast.update(delta);

            if (this.currentCast.done) {
                this.currentCast.cancel();
                this.currentCast = null;
            }
        } else {
            if (!this.castingShield) {
                this.player.regenMana();
            }
        }

        if (this.channelMagicCast.currentValue >= this.maxMagicValue) {
            this.particleHandler.createMagicEffect(this.player.position, this.player.inverse);
            this.maxMagicAudio.play();
        }

        if (this.castingShield) {

            this.shieldCollidables = [];
            for (let collidable of this.refShieldCollidables) {
                this.shieldCollidables.push(new Rectangle(collidable.x + this.player.position.x, collidable.y + this.player.position.y, collidable.width, collidable.height));
            }
            this.shieldAudio.play();
            this.particleHandler.createShieldEffect(this.player.getCalculatedPos(this.player.position, 0), this.player.inverse, this.shieldLevel);
        }

        this.updateBreak(delta);
    }

    public cast(spellType: SpellType) {
        switch (spellType) {
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

            case SpellType.channelmagic: this.castChannelMagic();
                break;
        }
    }

    private createShieldCollidables() {
        this.refShieldCollidables = [];
        let posx = 17;
        let posy = 40;

        for (let i = 0; i < 20; i++) {
            let angle: number;
            let x: number;
            angle = Math.PI * (i * 0.1 + 0.6);
            x = posx + (30 * Math.cos(angle));

            let y = posy + (40 * Math.sin(angle));
            this.refShieldCollidables.push(new Rectangle(x, y, 12, 12));
        }
    }

    private castShield() {
        if (this.player.useMana(0.1)) {
            if (this.break == 0) {
                this.castingShield = true;
            }
        } else {
            this.break = 500;
            this.player.shieldExplosion(this.player.inverse);
        }
    }

    private updateBreak(delta: number) {
        this.break -= delta;

        if (this.break < 0) {
            this.break = 0;
        }
    }

    private castFireBall() {
        if (!this.currentCast || (this.currentCast == this.fireBallCast && this.fireBallCast.currentAnimation.repetitions == 1)) {
            if (this.player.useMana(20)) {
                this.fireBallCast.reset();
                this.fireBallCast.size = this.channelMagicCast.currentValue;
                this.channelMagicCast.resetValue();
                this.currentCast = this.fireBallCast;
            } else {
                this.break = 500;
                if (this.castingShield) {
                    this.player.shieldExplosion(this.player.inverse);
                }
            }
        }
    }

    private castElectricBall() {

    }

    private castChannelMagic() {
        if ((!this.currentCast || this.currentCast == this.channelMagicCast) && this.player.isMoving()) {
            this.channelMagicCast.channeling = true;
            this.channelMagicCast.done = false;
            this.currentCast = this.channelMagicCast;
        }
    }

    private castFireBlast() {
        if (!this.currentCast || this.currentCast == this.fireBlastCast) {
            if (this.player.useMana(0.5)) {
                this.fireBlastCast.reset();
                this.currentCast = this.fireBlastCast;
            } else {
                this.break = 500;
                if (this.castingShield) {
                    this.player.shieldExplosion(this.player.inverse);
                }
            }
        }
    }

    private castFrostBlast() {
        if (!this.currentCast || this.currentCast == this.frostBlastCast) {
            if (this.player.useMana(0.5)) {
                this.frostBlastCast.reset();
                this.currentCast = this.frostBlastCast;
            } else {
                this.break = 500;
                if (this.castingShield) {
                    this.player.shieldExplosion(this.player.inverse);
                }
            }
        }
    }

    private initCasts() {
    
        let fireblastAnimation = new Animation([178]);
        fireblastAnimation.repetitions = 1;

        let onFireCast = this.getOnCastFireBlast(this.fireLevel);

        this.fireBlastCast = new InstantCast(fireblastAnimation, onFireCast);

        let frostBlastAnimation = new Animation([178]);
        frostBlastAnimation.repetitions = 1;

        let onFrostCast = this.getOnCastFrostBlast(this.frostLevel);

        this.frostBlastCast = new InstantCast(frostBlastAnimation, onFrostCast);

        let channelAnimation = new Animation([175]);

        let channelLowerAnimation = new Animation([162]);

        let onChannelMagic = () => {
            this.particleHandler.createChannelMagic(this.player.position, this.player.inverse);
            this.magicChannelAudio.play();
        };

        let onCancelChannelMagic = () => {
        }

        this.channelMagicCast = new ChannelCast(channelAnimation, channelLowerAnimation, onChannelMagic, onCancelChannelMagic, 25 + (5 * this.fireLevel), this.maxMagicValue, 0.03);

        let castAnimation = new Animation([170, 176, 177, 176]);
        castAnimation.repetitions = 3;
        castAnimation.timeToChange = 170;

        let onFireBallUpdate = (area: Rectangle, inverse: boolean, offsetX: number) => {
            this.particleHandler.createFireBall(new Vector(area.x, area.y), area.width, inverse, offsetX);
        };

        let onFireBallCast = (animation: Animation, size: number) => {

            this.projectileHandler.createFireBall(this.player.getCalculatedPos(this.player.position, size), this.player.inverse, 0.6, size, 11, onFireBallUpdate);
            this.animationHandler.audioHandler.playSound("foom.wav", 1, 0, 0.03)
            return animation;
        };

        this.fireBallCast = new SpellCast(castAnimation, 2, onFireBallCast);
    }

    private getOnCastFireBlast(fireLevel: number) {
        if (fireLevel == 0) {
            return (animation: Animation) => {
                this.particleHandler.createFireBlast(this.player.position, this.player.inverse, 0);
                this.flameThrowerAudio.play();
                return animation;
            };
        } else if (fireLevel == 1) {
            return (animation: Animation) => {
                this.particleHandler.createFireBlast(this.player.position, this.player.inverse, 1);
                this.flameThrowerAudio.play();
                return animation;
            };
        } else if (fireLevel == 2) {
            return (animation: Animation) => {
                this.particleHandler.createFireBlast(this.player.position, this.player.inverse, 2);
                this.flameThrowerAudio.play();
                return animation;
            };
        } else {
            return (animation: Animation) => {
                this.particleHandler.createFireBlast(this.player.position, this.player.inverse, 3);
                this.flameThrowerAudio.play();
                return animation;
            };
        }
    }

    private getOnCastFrostBlast(frostLevel: number) {
        if (frostLevel == 0) {
            return (animation: Animation) => {
                this.particleHandler.createFrostBlast(this.player.position, this.player.inverse, 0);
                this.freezeAudio.play();
                return animation;
            };
        } else if (frostLevel == 1) {
            return (animation: Animation) => {
                this.particleHandler.createFrostBlast(this.player.position, this.player.inverse, 1);
                this.freezeAudio.play();
                return animation;
            };
        } else if (frostLevel == 2) {
            return (animation: Animation) => {
                this.particleHandler.createFrostBlast(this.player.position, this.player.inverse, 2);
                this.freezeAudio.play();
                return animation;
            };
        } else {
            return (animation: Animation) => {
                this.particleHandler.createFrostBlast(this.player.position, this.player.inverse, 3);
                this.freezeAudio.play();
                return animation;
            }
        };
    }

    

}