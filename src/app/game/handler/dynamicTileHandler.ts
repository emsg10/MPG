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
            let travelDistance = dynamicTile.velocity.y * delta;
            dynamicTile.update(delta, travelDistance);

            if (player.lift == dynamicTile) {
                if(dynamicTile.velocity.y < 0) {
                    player.position.y = dynamicTile.tile.y - player.height;
                } else {
                    player.position.y = dynamicTile.tile.y - player.height;
                }

                player.liftVelocity = dynamicTile.velocity;

                if(player.position.x > dynamicTile.tile.x + dynamicTile.tile.width || player.position.x + player.width < dynamicTile.tile.x) {
                    player.lift = null;
                    player.liftVelocity = new Vector(0, 0);
                }
            }
        }
    }

    public createRenderCall(renderCall: RenderCall, camera: Vector) {
        for (let dynamicTile of this.dynamicTiles) {
            renderCall.vertecies = this.renderHelper.getVertecies(dynamicTile.tile.x - camera.x, dynamicTile.tile.y - camera.y, dynamicTile.tile.width, dynamicTile.tile.height, renderCall.vertecies);
            renderCall.textureCoords = this.renderHelper.getTextureCoordinates(renderCall.textureCoords, dynamicTile.tile.tileTextureType);
            renderCall.indecies = this.renderHelper.getIndecies(renderCall.indecies);
            renderCall.color = this.renderHelper.getColor(renderCall.color, null);
        }
    }

}