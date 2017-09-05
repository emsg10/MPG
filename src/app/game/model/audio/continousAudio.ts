export class ContinuousAudio {

    private continue = false;
    private playing = false;
    private source: AudioBufferSourceNode;
    private gainNode = this.audioContext.createGain();

    constructor(private audioContext: AudioContext, private data: AudioBuffer, private duration: number, private offset: number, private gainValue: number) {
        this.gainNode.connect(this.audioContext.destination);
    }

    public update() {
        if (!this.continue) {
            if (this.source) {
                this.stop();
            }
        }

        this.continue = false;
    }

    public play() {
        this.continue = true;
        if (!this.playing) {
            this.gainNode.gain.value = this.gainValue;
            this.source = this.audioContext.createBufferSource();
            this.source.buffer = this.data;
            this.source.connect(this.gainNode);
            this.source.start(0, this.offset, this.duration);
            this.source.loop = true;
            this.source.onended = () => {
                this.playing = false;
            };
            this.playing = true;
        }
    }

    public reset() {
        this.stop();
    }

    private stop() {
        if (this.playing) {
            this.gainNode.gain.value = 0;
            this.source.stop(this.audioContext.currentTime + 0.01);
        }
    }
}