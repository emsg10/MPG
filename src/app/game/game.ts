import { Context, TileMap, Render } from './';
import { RenderCall } from './render/renderCall';
import { Player } from './player/player';
import { Vector, Rectangle, Asset, Level } from './model';
import { CollisionDetection } from './collision/collisionDetection';
import { Gravity } from './forces/gravity';
import { TextRenderer } from './text/textRenderer';
import { Observable } from 'rxjs';
import { Editor } from './editor/editor';
import { Animation } from './animation/animation';

export class Game {
	public canvasWidth = 1200;
	public canvasHeight = 800;
	private fps = 60;
	private context: Context;
	private tileMap: TileMap;
	private render: Render = new Render();
	private renderCalls: RenderCall[] = [];
	private collision: CollisionDetection = CollisionDetection.getInstance();
	private player: Player;
	private leftKeyPress: boolean;
	private rightKeyPress: boolean;
	private jumpKeyPress: boolean;
	private started: boolean = false;
	private lastUpdate: number;
	private textRenderer: TextRenderer;
	private intevalTimer: any;
	private gameArea = new Rectangle(-50, -50, this.canvasWidth + 100, this.canvasHeight + 100);
	private startElement: HTMLElement;
	private restartElement: HTMLElement;
	private level: Level;
	private loadedLevel: Level;
	private editor: Editor;
	private animation: Animation;
	

	constructor(private asset: Asset, startElement: HTMLElement, restartElement: HTMLElement, canvas: HTMLCanvasElement, level: Level, editor?: Editor) {
		this.startElement = startElement;
		this.restartElement = restartElement;
		this.loadedLevel = level;
		this.level = this.loadedLevel.copy();
		this.editor = editor;

		this.context = new Context(asset, 1200, 800, canvas);

		this.animation = new Animation(this.context);
		this.tileMap = new TileMap(this.context);
		this.player = new Player(new Vector(this.level.playerPosition.x, this.level.playerPosition.y), this.context, 45, 45);
		this.textRenderer = new TextRenderer(this.context);
		this.initKeyBindings();
		this.initLoop();
	}

	public reset(level: Level) {
		this.level = this.loadedLevel.copy();
		this.player = new Player(this.level.playerPosition, this.context, 45, 45);
		this.started = false;
	}

	private initLoop() {
		this.intevalTimer = setInterval(this.run(), 0);
	}

	private run() {
		let loops = 0, skipTicks = 1000 / this.fps,
			maxFrameSkip = 10,
			nextGameTick = (new Date).getTime();

		return () => {
			loops = 0;

			while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
				let delta = nextGameTick - this.lastUpdate;
				this.lastUpdate = nextGameTick;
				this.renderCalls = [];

				if (!this.started) {
					if (this.editor) {
						this.renderCalls.push(this.editor.createRenderCall());
					}
				} else {
					if (!this.player.dead) {
						this.collision.checkCoutOfBounds(this.player, this.gameArea);
						let collisionData = this.collision.collisionDetection(this.level.tiles, this.player);
						this.checkKeys(delta);
						this.player.update(collisionData, delta);
						this.animation.update(delta);
						this.animation.checkForAnimation(collisionData, this.player);
					} else {
						this.animation.update(delta);
					}

				}

				nextGameTick += skipTicks;
				loops++;
			}

			if (loops) {
				this.context.clear();

				//EDITOR
				if(!this.started) {
					this.renderCalls.push(this.tileMap.createRenderCall([this.editor.currentTile]));
					this.renderCalls.push(this.editor.preview.createRenderCall());
				}

				//Game
				if (this.player.dead) {
					this.renderCalls.push(this.textRenderer.createTextRenderCall(400, 64, 50));
					//clearInterval(this.intevalTimer);
				} else {
					this.renderCalls.push(this.player.createRenderCall());
				}

				this.renderCalls.push(this.tileMap.createRenderCall(this.level.tiles));
				this.renderCalls.push(this.animation.createRenderCall());
				this.render.render(this.renderCalls);
			}
		};
	}

	private checkKeys(delta: number) {
		if (this.leftKeyPress) {
			this.player.moveLeft(delta);
		}

		if (this.rightKeyPress) {
			this.player.moveRight(delta);
		}

		if (this.jumpKeyPress) {
			this.player.jump();
		}
	}

	private initKeyBindings() {

		document.body.addEventListener("keypress", (event: KeyboardEvent) => {

			var keyCode = event.keyCode;

			switch (keyCode) {
				case 97:
					this.leftKeyPress = true;
					break;
				case 100:
					this.rightKeyPress = true;
					break;
				case 119:
					this.jumpKeyPress = true;
			}

		});

		document.body.addEventListener("keyup", (event: KeyboardEvent) => {

			var keyCode = event.keyCode;

			switch (keyCode) {
				case 65:
					this.leftKeyPress = false;
					break;
				case 68:
					this.rightKeyPress = false;
					break;
				case 87:
					this.jumpKeyPress = false;
					break;
			}
		});

		this.startElement.addEventListener("click", (event: MouseEvent) => {
			this.started = true;
		});

		this.restartElement.addEventListener("click", (event: MouseEvent) => {
			this.reset(this.loadedLevel);
		});

	}
}