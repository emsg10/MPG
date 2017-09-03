import { AudioAsset, ContinuousAudio } from "../model/index";

export class AudioHandler {

    private audioContext = new AudioContext();
    private sources = new Map<string, AudioBuffer>();
    private flameThrowerContinuos: ContinuousAudio;

    constructor(private audioAsset: AudioAsset) {

        let count = 0;
        audioAsset.bufferDatas.forEach((data, key) => {
            this.audioContext.decodeAudioData(data).then(it => {
                this.sources.set(key, it);
                count++;

                if(count >= this.audioAsset.bufferDatas.size) {
                    this.afterLoad();
                }
            });
        });
    }

    public update(delta: number) {
        this.flameThrowerContinuos.update();
    }

    public playSound(key: string) {
        let bufferData = this.sources.get(key);

        if(bufferData) {
            let gainNode = this.audioContext.createGain();
            let source = this.audioContext.createBufferSource();
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.value = 0.3;
            source.buffer = bufferData;
            source.connect(gainNode);
            source.start();
        }
    }

    public playFlameThrower() {
        this.flameThrowerContinuos.play();
    }

    public reset() {
        this.flameThrowerContinuos.reset();
    }

    private afterLoad() {
        this.flameThrowerContinuos = new ContinuousAudio(this.audioContext, this.sources.get("flamethrower.ogg"), 3.5, 0);
    }
}