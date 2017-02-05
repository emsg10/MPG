import { Tile } from '../model';
import { Enemy } from '../character/enemy';
import { RenderCall, RenderHelper } from '../render';
import { Context } from '../context';

export class EnemyHandler {

    public enemies: Enemy[] = [];

    private context: Context;
    private renderHelper = RenderHelper.getInstance();

    constructor(context: Context) {
        this.context = context;
    }

    public update(delta: number, tiles: Tile[]) {
        for(let enemy of this.enemies) {
            enemy.update(delta, tiles);
        }
    }

    createRenderCall() {
        let renderCall = new RenderCall();

		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];

		for(let enemy of this.enemies) {
            if(enemy.inverse) {
                vertecies = this.renderHelper.getInverseVertecies(enemy.position.x, enemy.position.y, enemy.width, enemy.height, vertecies);
            } else {
                vertecies = this.renderHelper.getVertecies(enemy.position.x, enemy.position.y, enemy.width, enemy.height, vertecies);
            }
            textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, enemy.runningAnimation.getCurrentFrame());
			indecies = this.renderHelper.getIndecies(indecies);
		}

		renderCall.vertecies = vertecies;
		renderCall.textureCoords = textureCoords;
		renderCall.indecies = indecies;
		renderCall.context = this.context;

		return renderCall;
    }

    remove(enemy: Enemy) {
        let index = this.enemies.indexOf(enemy);
        if(index >= 0) {
            this.enemies.splice(index, 1);
        }
    }

}