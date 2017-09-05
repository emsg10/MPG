import { AudioAsset, ContinuousAudio } from "../model/index";

export class AudioHandler {

    private audioContext = new AudioContext();
    private sources = new Map<string, AudioBuffer>();
    private continiousAudio: ContinuousAudio[] = [];

    constructor(private audioAsset: AudioAsset) {

        audioAsset.bufferDatas.forEach((data, key) => {
            this.audioContext.decodeAudioData(data).then(it => {
                this.sources.set(key, it);
            });
        });
    }

    public createContinuos(name: string, duration: number, offset: number, volume: number) {
        let continious = new ContinuousAudio(this.audioContext, this.sources.get(name), duration, offset, volume);
        this.continiousAudio.push(continious);

        return continious;
    }

    public update(delta: number) {
        for (let continious of this.continiousAudio) {
            continious.update();
        }
    }

    public playSound(key: string, duration: number, offset: number, volume: number) {
        let bufferData = this.sources.get(key);

        if (bufferData) {
            let gainNode = this.audioContext.createGain();
            let source = this.audioContext.createBufferSource();
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.value = volume;
            source.buffer = bufferData;
            source.connect(gainNode);
            source.start(0, offset, duration);
        }
    }

    public reset() {
        for (let continious of this.continiousAudio) {
            continious.reset();
        }
    }
}