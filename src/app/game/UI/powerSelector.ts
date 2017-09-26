import { RenderCall, Renderer, RenderHelper } from '../render';
import { Rectangle } from '../model';
import { Active } from './active';

export class PowerSelector {

    private renderHelper = RenderHelper.getInstance();

    constructor(public actives: [Active, Active, Active]) {
    }

    public render(renderCalls: Map<number, RenderCall>) {
        for (let active of this.actives) {
            active.createRenderCall(renderCalls);
        }

        return renderCalls;
    }

    public click(mouseposition: [number, number]) {
        for (let active of this.actives) {
            if(!this.actives[0].active) {
                this.actives[0].click(mouseposition);
                break;
            } else if(!this.actives[1].active) {
                this.actives[1].click(mouseposition);
                break;
            } else if(!this.actives[2].active) {
                this.actives[2].click(mouseposition);
                break;
            }
        }
    }

    public getPoints() {
        return this.actives[0].value + this.actives[1].value + this.actives[2].value;
    }

    public fill(points: number) {

        let active1 = this.actives[0];
        let active2 = this.actives[1];
        let active3 = this.actives[2];

        active1.reset();
        active2.reset();
        active3.reset();

        for(let i = 0; i < points; i++) {
            
            if(!active1.active) {
                active1.addPoint();
            } else if(!active2.active) {
                active2.addPoint();
            } else if(!active3.active) {
                active3.addPoint();
            }
            
        }
    }
}