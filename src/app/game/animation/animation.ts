import { Vector, Sprite, Rectangle } from '../model'
import { Animate } from './animate';
import { TextureMapper } from '../render/textureMapper';
import { RenderCall } from '../render/renderCall';
import { RenderHelper } from '../render/renderHelper';
import { Context } from '../context';
import { CollisionData } from '../collision/collisionData';
import { Player } from '../player/player';

export class Animation {

    public animations: Animate[] = [];
    private textureMapper = TextureMapper.getInstance();
    private renderHelper = RenderHelper.getInstance();
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public bloodAnimation_A(position: Vector) {
        let animate = new Animate();
        animate.textureNumber.push(100);
        animate.textureNumber.push(101);
        animate.textureNumber.push(102);
        animate.textureNumber.push(103);
        animate.textureNumber.push(104);
        animate.textureNumber.push(105);
        animate.areaToRender = new Rectangle(position.x, position.y, 50, 50);

        animate.repetitions = 6;

        this.animations.push(animate);
    }

    public bloodAnimation_B_Right(position: Vector) {
        let animate = new Animate();
        animate.textureNumber.push(106);
        animate.textureNumber.push(107);
        animate.textureNumber.push(108);
        animate.textureNumber.push(109);
        animate.textureNumber.push(110);
        animate.textureNumber.push(111);
        animate.areaToRender = new Rectangle(position.x, position.y, 100, 100);

        animate.repetitions = 6;

        this.animations.push(animate);
    }

    public bloodAnimation_B_Left(position: Vector) {
        let animate = new Animate();
        animate.textureNumber.push(106);
        animate.textureNumber.push(107);
        animate.textureNumber.push(108);
        animate.textureNumber.push(109);
        animate.textureNumber.push(110);
        animate.textureNumber.push(111);
        animate.areaToRender = new Rectangle(position.x, position.y, 100, 100);

        animate.inverse = true;

        animate.repetitions = 6;

        this.animations.push(animate);
    }

    public checkForAnimation(collisionData: CollisionData, player: Player) {
        if(collisionData.fallDeath) {
            this.bloodAnimation_A(new Vector(player.position.x, player.position.y));
            this.bloodAnimation_B_Right(new Vector(player.position.x + 5, player.position.y - 15));
            this.bloodAnimation_B_Left(new Vector(player.position.x - 55, player.position.y - 15));
        }
    }

    public update(delta: number) {

        let completedAnimations: Animate[] = [];        

        for(let animation of this.animations) {
            animation.next(delta);
            if(animation.repetitions <= 0) {
                completedAnimations.push(animation);
            }
        }

        for(let completedAnimation of completedAnimations) {
            this.animations.splice(this.animations.indexOf(completedAnimation), 1);
        }
    }

    public createRenderCall() {
        let renderCall = new RenderCall();

		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];

		for(let animation of this.animations) {
            if(animation.inverse) {
                vertecies = this.renderHelper.getInverseVertecies(animation.areaToRender.x , animation.areaToRender.y, animation.areaToRender.width, animation.areaToRender.height, vertecies);
            } else {
                vertecies = this.renderHelper.getVertecies(animation.areaToRender.x , animation.areaToRender.y, animation.areaToRender.width, animation.areaToRender.height, vertecies);
            }
            textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, animation.getCurrentFrame());
			indecies = this.renderHelper.getIndecies(indecies);
		}

		renderCall.vertecies = vertecies;
		renderCall.textureCoords = textureCoords;
		renderCall.indecies = indecies;
		renderCall.context = this.context;

		return renderCall;
    }

}