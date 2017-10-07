import { AudioAsset, ContinuousAudio } from "../model/index";
import { AudioQueueItem } from "../model/audioQueueItem";

export class AudioHandler {

    private audioContext = new AudioContext();
    private sources = new Map<string, AudioBuffer>();
    private continiousAudio: ContinuousAudio[] = [];
    private queue: AudioQueueItem[] = [];
    private loopingSources: AudioBufferSourceNode[] = [];

    constructor(private audioAsset: AudioAsset) {

        audioAsset.bufferDatas.forEach((data, key) => {
            this.audioContext.decodeAudioData(data).then(it => {
                this.sources.set(key, it);

                if(this.sources.size >= audioAsset.bufferDatas.size) {
                    this.onLoad();
                }
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

    public playSound(key: string, duration: number, offset: number, volume: number, loop?: boolean) {
        let bufferData = this.sources.get(key);
        if (bufferData) {
            let gainNode = this.audioContext.createGain();
            let source = this.audioContext.createBufferSource();
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.value = volume;
            source.buffer = bufferData;
            source.connect(gainNode);
            if(loop) {
                source.loop = true;
                source.start(0);
                this.loopingSources.push(source);
            } else {
                source.start(0, offset, duration);
            }
            
        } else {
            this.queue.push({
                key: key,
                duration: duration,
                offset: offset,
                volume: volume,
                loop: loop
            });
        }
    }

    public endLoops() {
        for(let source of this.loopingSources) {
            source.stop();
        }
    }

    public reset() {
        for (let continious of this.continiousAudio) {
            continious.reset();
        }
    }

    private onLoad() {
        for(let item of this.queue) {
            this.playSound(item.key, item.duration, item.offset, item.volume, item.loop);
        }

        this.queue = [];
    }
}