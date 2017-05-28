import { Context, TileMap, Renderer } from './';
import { RenderCall, ParticleRenderer, DynamicRenderCall, ColorRenderCall, ColorRenderer } from './render';
import { Player } from './character/player';
import { Enemy } from './character/enemy';
import { Swordman } from './character/swordman';
import { Vector, Rectangle, Asset, SpellType, Level, Tile, Animation, DynamicTile } from './model';
import { CollisionDetection } from './collision/collisionDetection';
import { Gravity } from './forces/gravity';
import { TextRenderer } from './text/textRenderer';
import { Observable } from 'rxjs';
import { AnimationHandler } from './handler/animationHandler';
import { ProjectileHandler } from './handler/projectileHandler';
import { DynamicTileHandler } from './handler/dynamicTileHandler';
import { ParticleHandler } from './handler/particleHandler';
import { SimpleParticleRenderer } from './render/simpleParticleRenderer';
import { SimpleParticleRenderCall } from './render/simpleParticleRenderCall';
import { DebugHandler } from './handler/debugHandler';
import { EnemyHandler } from './handler/enemyHandler';
import { LevelData, EnemyType } from './map/model';
import { Camera } from './camera';
import { Archer } from './character/archer';
import { DynamicRenderer } from './render/dynamicRenderer';
import { UI } from './UI/ui';
import { LoadHelper} from './service/loadHelper';

export class Game {
	public canvasWidth = 1200;
	public canvasHeight = 800;
	public context: Context;

	private fps = 60;
	private tileMap: TileMap;
	private renderer: Renderer;
	private colorRenderer: ColorRenderer;
	private simpleParticleRenderer: SimpleParticleRenderer;
	private dynamicRenderer: DynamicRenderer;
	private collision: CollisionDetection = CollisionDetection.getInstance();
	private loadHelper = LoadHelper.getInstance();
	private player: Player;
	private leftKeyPress: boolean;
	private rightKeyPress: boolean;
	private jumpKeyPress: boolean;
	private fireballKeyPress: boolean;
	private channelMagicKeyPress: boolean;
	private frostKeyPress: boolean;
	private fireKeyPress: boolean;
	private started: boolean = false;
	private lastUpdate: number;
	private textRenderer: TextRenderer;
	private intevalTimer: any;
	private gameArea = new Rectangle(-50, -50, this.canvasWidth + 100, this.canvasHeight + 100);
	private startElement: HTMLElement;
	private restartElement: HTMLElement;
	private level: Level = new Level();
	private levelData: LevelData;
	private animationHandler: AnimationHandler;
	private projectileHandler: ProjectileHandler;
	private dynamicTileHandler: DynamicTileHandler;
	private UI: UI;
	private enemyHandler: EnemyHandler;
	private particleHandler: ParticleHandler;
	private debugHandler = DebugHandler.getInstance();
	private camera: Camera;
	private mouseRenderCall: RenderCall;
	private levelCompleted = false;

	constructor(private asset: Asset, startElement: HTMLElement, restartElement: HTMLElement, canvas: HTMLCanvasElement, level: LevelData) {

		this.startElement = startElement;
		this.restartElement = restartElement;

		this.context = new Context(asset, this.canvasWidth, this.canvasHeight, canvas);
		this.renderer = new Renderer(this.context);
		this.colorRenderer = new ColorRenderer(this.context);
		this.simpleParticleRenderer = new SimpleParticleRenderer(this.context);
		this.dynamicRenderer = new DynamicRenderer(this.context);
		this.levelData = level;

		this.initKeyBindings();
		this.reset(this.levelData, null);
		this.initLoop();
		
	}

	public reset(levelData: LevelData, mouseRenderCall: RenderCall) {
		if (!(mouseRenderCall && this.started)) {
			this.loadLevel(levelData);
			this.started = false;
		}

		this.mouseRenderCall = mouseRenderCall;
	}

	private initLoop() {
		this.intevalTimer = setInterval(this.run(), 0);
	}

	private run() {
		this.lastUpdate = (new Date).getTime();
		let loops = 0, skipTicks = 1000 / this.fps,
			maxFrameSkip = 3,
			nextGameTick = (new Date).getTime();

		return () => {
			loops = 0;

			while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
				let delta = nextGameTick - this.lastUpdate;
				this.lastUpdate = nextGameTick;
				//this.debugHandler.debugRects = [];

				if (this.started) {
					if (!this.player.dead && !this.levelCompleted) {
						this.checkGoal();
						this.checkKeys(delta);
						this.collision.checkCoutOfBounds(this.player, new Vector(this.levelData.gameSize[0], this.levelData.gameSize[1]));
						this.player.update(this.level.tiles, this.dynamicTileHandler.dynamicTiles, delta);
						this.dynamicTileHandler.update(this.player, delta);
						this.enemyHandler.update(delta, this.level.tiles, this.player);
						this.animationHandler.update(delta);
						this.projectileHandler.update(delta, this.level.tiles, this.player, this.dynamicTileHandler.dynamicTiles);
						this.UI.update(this.player.hp, this.player.mana);
						this.camera.update(this.player.position);
					} else {
						this.animationHandler.update(delta);
						this.projectileHandler.update(delta, this.level.tiles, this.player, this.dynamicTileHandler.dynamicTiles);
					}
				}
				this.particleHandler.update(delta, this.enemyHandler.enemies);

				this.render();

				nextGameTick += skipTicks;
			}
		};
	}

	private render() {
		this.context.clear([0, 0, 0, 0.95]);
		let dynamicRenderCall = new DynamicRenderCall();
		let renderCall = new RenderCall();
		let renderCalls: RenderCall[] = [];
		let colorRenderCall = new ColorRenderCall();
		let colorRenderCalls: ColorRenderCall[] = [];

		let simpleRenderCalls: SimpleParticleRenderCall[] = [];

		//this.debugHandler.debugRects = [this.player.getProjectileCollisionArea()];

		//EDITOR
		if (!this.started) {
			if (this.mouseRenderCall) {
				renderCalls.push(this.mouseRenderCall);
			}
		}

		//GAME
		this.enemyHandler.createRenderCall(colorRenderCall, this.camera.position);
		this.tileMap.createRenderCall(this.level.tiles, renderCall, this.camera.position);
		this.tileMap.createGoalRenderCall(this.level.end, renderCall, this.camera.position);

		if (this.player.dead) {
			this.textRenderer.createTextRenderCall(400, 64, 50, renderCall);

			for (let stickyAnimation of this.player.damageAnimations) {
				this.animationHandler.remove(stickyAnimation.animation);
			}
			this.player.damageAnimations = [];
		} else if (this.levelCompleted) {
			this.textRenderer.createTextRenderCall(800, 96, 51, renderCall);
		} else {
			renderCall = this.player.createRenderCall(renderCall, colorRenderCall, this.camera.position)
		}

		this.dynamicTileHandler.createRenderCall(renderCall, this.camera.position);
		this.animationHandler.createDynamicRenderCall(dynamicRenderCall, this.camera.position);
		this.animationHandler.createRenderCall(colorRenderCall, this.camera.position)
		this.UI.createRenderCall(renderCall, this.camera.position);
		simpleRenderCalls = this.particleHandler.createRenderCalls(simpleRenderCalls, this.camera.position);

		this.debugHandler.createRenderCall(renderCall, this.camera.position);

		renderCalls.push(renderCall);
		colorRenderCalls.push(colorRenderCall);

		this.renderer.render(renderCalls);
		this.colorRenderer.render(colorRenderCalls);
		this.simpleParticleRenderer.render(simpleRenderCalls);
		this.dynamicRenderer.render([dynamicRenderCall]);
	}

	private checkGoal() {
		this.levelCompleted = this.collision.aabbCheck(this.player.getCollisionArea(), this.level.end);
	}

	private checkKeys(delta: number) {
		if (!this.player.stunned) {
			if (this.leftKeyPress) {
				this.player.moveLeft(delta);
			} else if (this.rightKeyPress) {
				this.player.moveRight(delta);
			}

			if (this.jumpKeyPress) {
				this.player.jump();
			}

			if (this.frostKeyPress) {
				this.player.cast(SpellType.frostBlast);
			} else if (this.fireKeyPress) {
				this.player.cast(SpellType.fireBlast);
			} else if (this.fireballKeyPress) {
				this.player.cast(SpellType.fireball);
			} else if (this.channelMagicKeyPress) {
				this.player.cast(SpellType.channelmagic);
			}
		}
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
					this.fireballKeyPress = true;
					break;
				case 'Numpad2':
					this.channelMagicKeyPress = true;
					break;
				case 'Numpad3':
					this.frostKeyPress = true;
					break;
				case 'Numpad4':
					this.fireKeyPress = true;
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
					this.fireballKeyPress = false;
					break;
				case 'Numpad2':
					this.channelMagicKeyPress = false;
					break;
				case 'Numpad3':
					this.frostKeyPress = false;
					break;
				case 'Numpad4':
					this.fireKeyPress = false;
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
			this.reset(this.levelData, null);
		});

	}

	private loadLevel(levelData: LevelData) {

		this.particleHandler = new ParticleHandler();
		this.animationHandler = new AnimationHandler(this.particleHandler);
		this.projectileHandler = new ProjectileHandler(this.animationHandler);
		this.dynamicTileHandler = new DynamicTileHandler();

		this.level = this.loadHelper.levelDataToLevel(this.levelData, this.projectileHandler, this.animationHandler);
		this.particleHandler.tiles = this.level.tiles;

		this.camera = new Camera(new Vector(this.level.camera[0], this.level.camera[1]), new Vector(this.canvasWidth, this.canvasHeight));
		this.levelCompleted = false;

		this.player = new Player(new Vector(this.level.player[0], this.level.player[1]), this.context, this.projectileHandler, this.animationHandler, this.particleHandler, 48, 85, 100, 200);
		this.collision.createGrid(new Vector(this.level.gameSize[0], this.level.gameSize[1]), this.level.tiles);
		this.UI = new UI(100, 200);
		this.enemyHandler = new EnemyHandler(this.context, this.projectileHandler, this.animationHandler, this.particleHandler);
		this.enemyHandler.enemies = this.level.enemies;
		this.dynamicTileHandler.dynamicTiles = this.level.dynamicTiles;
		this.tileMap = new TileMap();

		this.textRenderer = new TextRenderer(this.context);

	}
}