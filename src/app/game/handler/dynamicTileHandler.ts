import { DynamicTile, Vector } from '../model';
import { Player } from '../character/player';
import { CollisionDetection } from '../collision/collisionDetection';
import { RenderHelper, RenderCall } from '../render';

export class DynamicTileHandler {

    public dynamicTiles: DynamicTile[];
    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();

    constructor() {
    }

    public update(player: Player, delta: number) {

        for (let dynamicTile of this.dynamicTiles) {

            let travelDistance: number;

            if (dynamicTile.verticalAxis) {
                travelDistance = dynamicTile.velocity.y * delta;
            } else {
                travelDistance = dynamicTile.velocity.x * delta;
            }

            dynamicTile.update(delta, travelDistance);

            if (player.lift == dynamicTile) {
                if (dynamicTile.velocity.y < 0) {
                    player.position.y = dynamicTile.tile.y - player.height;
                } else {
                    player.position.y = dynamicTile.tile.y - player.height;
                }

                player.liftVelocity = dynamicTile.velocity;

                if (player.position.x > dynamicTile.tile.x + dynamicTile.tile.width || player.position.x + player.width < dynamicTile.tile.x) {
                    player.lift = null;
                    player.liftVelocity = new Vector(0, 0);
                }
            }
        }

    }

    public createRenderCall(renderCalls: Map<number, RenderCall>) {
        for (let dynamicTile of this.dynamicTiles) {

            let renderCall = renderCalls.get(dynamicTile.tile.key);

            if(!renderCall) {
                renderCall = new RenderCall();
                renderCall.key = dynamicTile.tile.key;
                renderCalls.set(renderCall.key, renderCall);
            }

            renderCall.vertecies = this.renderHelper.getVertecies(dynamicTile.tile.x, dynamicTile.tile.y, dynamicTile.tile.width, dynamicTile.tile.height, renderCall.vertecies);
            renderCall.textureCoords.push.apply(renderCall.textureCoords, dynamicTile.textureCoordinates);
            renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
        }
    }

}