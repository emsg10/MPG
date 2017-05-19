import { SpellType, Cast, Animation, InstantCast, ChannelCast, Vector, Rectangle, SpellCast } from '../model';
import { AnimationHandler } from './animationHandler';
import { ProjectileHandler } from './projectileHandler';
import { ParticleHandler } from './particleHandler';
import { Player } from '../character/player';

export class SpellHandler {

    public currentCast: Cast;

    private animationHandler: AnimationHandler;
    private projectileHandler: ProjectileHandler;
    private particleHandler: ParticleHandler;
    private player: Player;

    private fireBlastCast: InstantCast;
    private frostBlastCast: InstantCast;
    private fireBallCast: SpellCast;

    private channelMagicCast: ChannelCast;

    private break: number = 0;

    constructor(animationHandler: AnimationHandler, projectileHandler: ProjectileHandler, particleHandler: ParticleHandler, player: Player) {
        this.animationHandler = animationHandler;
        this.projectileHandler = projectileHandler;
        this.particleHandler = particleHandler;
        this.player = player;

        this.initCasts();
    }

    public update(delta: number) {

        if (this.currentCast && this.break == 0) {
            this.currentCast.update(delta);

            if (this.currentCast.done) {
                this.currentCast.cancel();
                this.currentCast = null;
                this.currentCast = null;
            }
        } else {
           this.player.regenMana();
        }

        if (this.channelMagicCast.currentValue >= 100) {
            this.particleHandler.createMagicEffect(this.player.position, this.player.inverse);
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

            case SpellType.channelmagic: this.castChannelMagic();
                break;
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
            }
        }
    }

    private initCasts() {

        let fireblastAnimation = new Animation();
        fireblastAnimation.textureNumber.push(178);
        fireblastAnimation.repetitions = 1;

        let onFireCast = (animation: Animation) => {
            this.particleHandler.createFireBlast(this.player.position, this.player.inverse);

            return animation;
        };

        this.fireBlastCast = new InstantCast(fireblastAnimation, onFireCast);

        let frostBlastAnimation = new Animation();
        frostBlastAnimation.textureNumber.push(178);
        frostBlastAnimation.repetitions = 1;

        let onFrostCast = (animation: Animation) => {
            this.particleHandler.createFrostBlast(this.player.position, this.player.inverse);

            return animation;
        };

        this.frostBlastCast = new InstantCast(frostBlastAnimation, onFrostCast);

        let channelAnimation = new Animation();
        channelAnimation.textureNumber.push(175);

        let channelLowerAnimation = new Animation();
        channelLowerAnimation.textureNumber.push(162);

        let onChannelMagic = () => {
            this.particleHandler.createChannelMagic(this.player.position, this.player.inverse);
        };

        let onCancelChannelMagic = () => {
        }

        this.channelMagicCast = new ChannelCast(channelAnimation, channelLowerAnimation ,onChannelMagic, onCancelChannelMagic, 40, 100, 0.03);

        let castAnimation = new Animation();
        castAnimation.textureNumber.push(170);
        castAnimation.textureNumber.push(176);
        castAnimation.textureNumber.push(177);
        castAnimation.textureNumber.push(176);
        castAnimation.repetitions = 3;
        castAnimation.timeToChange = 250;

        let onFireBallUpdate = (area: Rectangle, inverse: boolean, offsetX: number) => {
            this.particleHandler.createFireBall(new Vector(area.x, area.y), area.width, inverse, offsetX);
        };

        let onFireBallCast = (animation: Animation, size: number) => {

            this.projectileHandler.createFireBall(this.player.getCalculatedPos(this.player.position, size), this.player.inverse, 0.6, size, 11, onFireBallUpdate);

            return animation;
        };

        this.fireBallCast = new SpellCast(castAnimation, 2, onFireBallCast);
    }

}