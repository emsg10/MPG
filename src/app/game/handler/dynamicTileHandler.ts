import { DynamicTile, Vector } from '../model';
import { Player } from '../character/player';
import { CollisionDetection } from '../collision/collisionDetection';
import { RenderHelper, RenderCall } from '../render';
import { Constants } from '../service/constants';

export class DynamicTileHandler {

    public dynamicTiles: DynamicTile[];
    private renderHelper = RenderHelper.getInstance();
    private collisionDetection = CollisionDetection.getInstance();
    private constants = Constants.getInstance();

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

            let set = renderCalls.get(dynamicTile.tile.key);

            if(!set) {
                renderCalls.set(dynamicTile.tile.key, new RenderCall());
				set = renderCalls.get(dynamicTile.tile.key);
            }

            set.vertecies = this.renderHelper.getVertecies(dynamicTile.tile.x, dynamicTile.tile.y, dynamicTile.tile.width, dynamicTile.tile.height, set.vertecies);
            set.textureCoords = this.renderHelper.getTiledTextureCoordinates(dynamicTile.tile, set.textureCoords, this.constants.tileSize);
            set.indecies = this.renderHelper.getIndecies(set.indecies);
        }

        return renderCalls;
    }

}