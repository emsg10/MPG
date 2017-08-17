import { Progress } from '../model';

export class LocalStorageHelper {
    private static instance: LocalStorageHelper = new LocalStorageHelper();

    constrcuctor() {
        if (LocalStorageHelper.instance) {
            throw new Error('Static class cant be instanced!');
        }

        LocalStorageHelper.instance = this;
    }

    public static getInstance() {
        return LocalStorageHelper.instance;
    }

    public progressionKey = "progression";

    public newPlayer(name: string) {

        let progression = this.getProgression();

        for(let p of progression){
            p.active = false;
            this.saveProgress(p);
        }

        let progress = new Progress();
        progress.playerName = name;
        progress.active = true;
        progress.completedLevels = 0;
        progress.fire = 0;
        progress.frost = 0;
        progress.defence = 0;
        progress.hp = 0;
        progress.mana = 0;

        this.saveProgress(progress);
    }

    public setPowers(fire: number, frost: number, defence: number) {
        let progress = this.getCurrentProgress();

        progress.fire = fire;
        progress.frost = frost;
        progress.defence = defence;

        this.saveProgress(progress);
    }

    public setCurrentProgress(level: number) {
        let progress = this.getCurrentProgress();
        if (progress.completedLevels < level) {
            progress.completedLevels = level;
        }

        this.saveProgress(progress);
    }

    public getProgression() {

        let progression = this.getItem(this.progressionKey) as Progress[]

        if(progression == null) {
            progression = [];
        }

        return progression;
    }

    public getCurrentProgress() {
        let progression = this.getItem(this.progressionKey) as Progress[];

        if (!progression) {
            progression = [this.defaultProgress()] as Progress[];
        }

        return progression.find(it => it.active == true);
    }

    public saveProgress(progress: Progress) {

        let progression = this.getItem(this.progressionKey) as Progress[];

        if (!progression) {
            progression = [];
        }

        let prg = progression.find(it => it.playerName == progress.playerName);

        if (prg) {
            let index = progression.indexOf(prg);
            if (index != -1) {
                progression.splice(index, 1);
            }

            progression.push(progress);
        } else {
            progression.push(progress);
        }

        this.setItem(this.progressionKey, progression);

    }

    public setActive(name: string) {
        let progression = this.getProgression();

        for(let progress of progression) {
            if(progress.playerName == name) {
                progress.active = true;
            } else {
                progress.active = false;
            }

            this.saveProgress(progress);
        }

    }

    private defaultProgress() {
        let progress = new Progress();
        progress.playerName = "nouser";
        progress.active = true;
        progress.completedLevels = 0;
        progress.fire = 0;
        progress.frost = 0;
        progress.defence = 0;
        progress.hp = 0;
        progress.mana = 0;

        return progress;
    }

    private getItem(key: string) {
        return JSON.parse(localStorage.getItem(key));
    }

    private setItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }



}