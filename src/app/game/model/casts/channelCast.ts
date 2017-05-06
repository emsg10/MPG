import { Animation, Cast } from '../../model';

export class ChannelCast extends Cast {

    public channeling: boolean = false;
    public currentValue: number;
    private onChannel: () => void;
    private onCancel: () => void;
    private defaultValue: number;
    private maxValue: number;
    private growth: number;
    private delay: number;

    constructor(channelAnimation: Animation, onChannel: () => void, onCancel: () => void, defaultValue: number, maxValue: number, growth: number) {
        super();
        this.onChannel = onChannel;
        this.onCancel = onCancel;
        this.currentAnimation = channelAnimation;
        this.defaultValue = defaultValue;
        this.maxValue = maxValue;
        this.growth = growth;
        this.currentValue = this.defaultValue;
    }

    public update(delta: number) {

        if(this.channeling) {
            this.delay = 150;
        }

        if (this.delay > 0) {

            this.currentAnimation.next(delta);
            
            if (this.currentValue >= this.maxValue) {
                this.currentValue = this.maxValue;
            } else {
                this.currentValue += (delta * this.growth);
            }

            this.onChannel();

        } else {
            this.done = true;
        }

        this.delay -= delta;
        this.channeling = false;
    }

    public resetValue() {
        this.currentValue = this.defaultValue;
    }

    public cancel() {
        this.onCancel();
    }

    public reset() {
        
    }
}