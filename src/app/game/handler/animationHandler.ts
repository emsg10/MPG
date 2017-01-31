import { Vector, Sprite, Rectangle, Animation } from '../model'
import { TextureMapper } from '../render/textureMapper';
import { RenderCall } from '../render/renderCall';
import { RenderHelper } from '../render/renderHelper';
import { Context } from '../context';
import { CollisionData } from '../collision/collisionData';
import { Player } from '../player/player';

export class AnimationHandler {

    public animations: Animation[] = [];
    private textureMapper = TextureMapper.getInstance();
    private renderHelper = RenderHelper.getInstance();
    private context: Context;

    constructor(context: Context) {
        this.context = context;
    }

    public bloodAnimation_A(position: Vector) {
        let animation = new Animation();
        animation.textureNumber.push(100);
        animation.textureNumber.push(101);
        animation.textureNumber.push(102);
        animation.textureNumber.push(103);
        animation.textureNumber.push(104);
        animation.textureNumber.push(105);
        animation.areaToRender = new Rectangle(position.x, position.y, 50, 50);

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public bloodAnimation_B_Right(position: Vector) {
        let animation = new Animation();
        animation.textureNumber.push(106);
        animation.textureNumber.push(107);
        animation.textureNumber.push(108);
        animation.textureNumber.push(109);
        animation.textureNumber.push(110);
        animation.textureNumber.push(111);
        animation.areaToRender = new Rectangle(position.x, position.y, 100, 100);

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public bloodAnimation_B_Left(position: Vector) {
        let animation = new Animation();
        animation.textureNumber.push(106);
        animation.textureNumber.push(107);
        animation.textureNumber.push(108);
        animation.textureNumber.push(109);
        animation.textureNumber.push(110);
        animation.textureNumber.push(111);
        animation.areaToRender = new Rectangle(position.x, position.y, 100, 100);

        animation.inverse = true;

        animation.repetitions = 6;

        this.animations.push(animation);

        return animation;
    }

    public fireball_right(position: Vector, size: number) {
        let animation = new Animation();
        animation.textureNumber.push(112);
        animation.textureNumber.push(113);
        animation.textureNumber.push(114);
        animation.textureNumber.push(115);
        animation.textureNumber.push(116);
        animation.textureNumber.push(117);
        animation.timeToChange = 50;
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        this.animations.push(animation);

        return animation;
    }

    public fireball_left(position: Vector, size: number) {
        let animation = new Animation();
        animation.textureNumber.push(112);
        animation.textureNumber.push(113);
        animation.textureNumber.push(114);
        animation.textureNumber.push(115);
        animation.textureNumber.push(116);
        animation.textureNumber.push(117);
        animation.timeToChange = 50;
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.inverse = true;

        this.animations.push(animation);

        return animation;
    }

    public fireball_destroy(position: Vector, size: number) {
        let animation = new Animation();
        animation.textureNumber.push(118);
        animation.textureNumber.push(119);
        animation.textureNumber.push(120);
        animation.textureNumber.push(121);
        animation.textureNumber.push(122);
        animation.textureNumber.push(123);
        animation.textureNumber.push(124);
        animation.textureNumber.push(125);
        animation.textureNumber.push(126);
        animation.timeToChange = 50;
        animation.areaToRender = new Rectangle(position.x, position.y, size, size);

        animation.inverse = true;

        animation.repetitions = 9;

        this.animations.push(animation);

        return animation;
    }

    public checkForAnimation(collisionData: CollisionData, player: Player) {
        if(collisionData.fallDeath) {
            this.bloodAnimation_A(new Vector(player.position.x, player.position.y));
            this.bloodAnimation_B_Right(new Vector(player.position.x + 5, player.position.y - 15));
            this.bloodAnimation_B_Left(new Vector(player.position.x - 55, player.position.y - 15));
        }
    }

    public update(delta: number) {

        let completedAnimations: Animation[] = [];        

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

    public remove(animation: Animation) {
        let index = this.animations.indexOf(animation);
        this.animations.splice(index, 1);
    }

}