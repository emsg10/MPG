import { Context, TileMap, Render } from './';
import { RenderCall } from './render/renderCall';
import { Player } from './character/player';
import { Vector, Rectangle, Asset, Level, SpellType } from './model';
import { CollisionDetection } from './collision/collisionDetection';
import { Gravity } from './forces/gravity';
import { TextRenderer } from './text/textRenderer';
import { Observable } from 'rxjs';
import { Editor } from './editor/editor';
import { AnimationHandler } from './handler/animationHandler';
import { ProjectileHandler } from './handler/projectileHandler';
import { EnemyHandler } from './handler/enemyHandler';

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
	private channelingKeyPress: boolean;
	private spellType: SpellType;
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
	private animationHandler: AnimationHandler;
	private projectileHandler: ProjectileHandler;
	private enemyHandler: EnemyHandler;


	constructor(private asset: Asset, startElement: HTMLElement, restartElement: HTMLElement, canvas: HTMLCanvasElement, level: Level, editor?: Editor) {
		this.startElement = startElement;
		this.restartElement = restartElement;
		this.loadedLevel = level;
		this.level = this.loadedLevel.copy();
		this.editor = editor;

		this.context = new Context(asset, 1200, 800, canvas);

		this.animationHandler = new AnimationHandler(this.context);
		this.enemyHandler = new EnemyHandler(this.context);
		this.projectileHandler = new ProjectileHandler(this.animationHandler, this.enemyHandler);

		this.tileMap = new TileMap(this.context);
		this.player = new Player(new Vector(this.level.playerPosition.x, this.level.playerPosition.y), this.context, this.projectileHandler, this.animationHandler, 45, 45);
		this.textRenderer = new TextRenderer(this.context);
		this.initKeyBindings();
		this.initLoop();
		this.reset(this.level);
	}

	public reset(level: Level) {
		this.level = level.copy();
		this.player = new Player(this.level.playerPosition, this.context, this.projectileHandler, this.animationHandler, 45, 45);
		this.enemyHandler.enemies = this.level.enemies;
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
						this.player.update(collisionData, delta, this.spellType);
						this.enemyHandler.update(delta, this.level.tiles);
						this.animationHandler.update(delta);
						this.animationHandler.checkForAnimation(collisionData, this.player);
						this.projectileHandler.update(delta, this.level.tiles);
					} else {
						this.animationHandler.update(delta);
					}

				}

				nextGameTick += skipTicks;
				loops++;
			}

			if (loops) {
				this.context.clear();

				//EDITOR
				if (!this.started) {
					if(this.editor.currentTile != null) {
						this.renderCalls.push(this.tileMap.createRenderCall([this.editor.currentTile]));
					}
					this.renderCalls.push(this.editor.currentEnemyRenderCall(this.context));
					this.renderCalls.push(this.editor.preview.createRenderCall());
					this.renderCalls.push(this.editor.createEnemyRenderCall());
				}

				//Game
				if (this.player.dead) {
					this.renderCalls.push(this.textRenderer.createTextRenderCall(400, 64, 50));
					//clearInterval(this.intevalTimer);
				} else {
					this.renderCalls.push(this.player.createRenderCall());
				}

				this.renderCalls.push(this.enemyHandler.createRenderCall());
				this.renderCalls.push(this.tileMap.createRenderCall(this.level.tiles));
				this.renderCalls.push(this.animationHandler.createRenderCall());
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

		this.player.channel(this.channelingKeyPress, delta, this.spellType);
	}

	private initKeyBindings() {

		document.body.addEventListener("keydown", (event: KeyboardEvent) => {

			var keyCode = event.code;

			switch (keyCode) {
				case 'KeyA':
					this.leftKeyPress = true;
					break;
				case 'KeyD':
					this.rightKeyPress = true;
					break;
				case 'KeyW':
					this.jumpKeyPress = true;
					break;
				case 'Numpad1':
					this.channelingKeyPress = true;
					this.spellType = SpellType.fireball;
					break;
				case 'Numpad2':
					this.channelingKeyPress = true;
					this.spellType = SpellType.electricbolt;
					break;
				case 'ArrowUp':
					this.jumpKeyPress = true;
					break;
				case 'ArrowRight':
					this.rightKeyPress = true;
					break;
				case 'ArrowLeft':
					this.leftKeyPress = true;
					break;
			}

		});

		document.body.addEventListener("keyup", (event: KeyboardEvent) => {

			var keyCode = event.code;

			switch (keyCode) {
				case 'KeyA':
					this.leftKeyPress = false;
					break;
				case 'KeyD':
					this.rightKeyPress = false;
					break;
				case 'KeyW':
					this.jumpKeyPress = false;
					break;
				case 'Numpad1':
					this.channelingKeyPress = false;
					break;
				case 'Numpad2':
					this.channelingKeyPress = false;
					break;
				case 'ArrowUp':
					this.jumpKeyPress = false;
					break;
				case 'ArrowRight':
					this.rightKeyPress = false;
					break;
				case 'ArrowLeft':
					this.leftKeyPress = false;
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