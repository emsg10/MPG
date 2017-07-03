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
        let progress = new Progress();
        progress.playerName = name;
        progress.active = true;
        progress.completedLevels = 0;
        progress.level = 1;
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
        progress.level++;
        if(progress.completedLevels < level) {
            progress.completedLevels = level;
        }

        this.saveProgress(progress);
    }

    public getCurrentProgress() {
        let progression = this.getItem(this.progressionKey) as Progress[];

        if(!progression) {
            this.newPlayer("newPLayer");
            progression = this.getItem(this.progressionKey) as Progress[];
        }

        return progression.find(it => it.active == true);
    }

    public saveProgress(progress: Progress) {

        let progression = this.getItem(this.progressionKey) as Progress[];

        if(!progression) {
            progression = [];
        }

         let prg = progression.find(it => it.playerName == progress.playerName);

        if(prg) {
            let index = progression.indexOf(prg);
            if(index != -1) {
                progression.splice(index, 1);
            }

            progression.push(progress);
        } else {
            progression.push(progress);
        }

        this.setItem(this.progressionKey, progression);

    }

    private getItem(key: string) {
        return JSON.parse(localStorage.getItem(key));
    }

    private setItem(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }



}