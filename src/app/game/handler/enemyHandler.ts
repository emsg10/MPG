import { Tile } from '../model';
import { Enemy } from '../character/enemy';
import { Player } from '../character/player';
import { Swordman } from '../character/swordman';
import { RenderCall, RenderHelper } from '../render';
import { Context } from '../context';

export class EnemyHandler {

    public enemies: Enemy[] = [];

    private context: Context;
    private renderHelper = RenderHelper.getInstance();

    constructor(context: Context) {
        this.context = context;
    }

    public update(delta: number, tiles: Tile[], player: Player) {
        for(let enemy of this.enemies) {
            enemy.update(delta, tiles, player);
        }
    }

    createRenderCall(renderCall: RenderCall) {

		for(let enemy of this.enemies) {
            if(enemy.inverse) {
                renderCall.vertecies = this.renderHelper.getInverseVertecies(enemy.position.x, enemy.position.y, enemy.width, enemy.height, renderCall.vertecies);
            } else {
                renderCall.vertecies = this.renderHelper.getVertecies(enemy.position.x, enemy.position.y, enemy.width, enemy.height, renderCall.vertecies);
            }
            renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, enemy.currentAnimation.getCurrentFrame());
			renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
		}

		return renderCall;
    }

    remove(enemy: Enemy) {
        let index = this.enemies.indexOf(enemy);
        if(index >= 0) {
            this.enemies.splice(index, 1);
        }
    }

}