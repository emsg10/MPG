import { Context, TileMap, Renderer } from './';
import { RenderCall, ParticleRenderer } from './render';
import { Player } from './character/player';
import { Enemy } from './character/enemy';
import { Swordman } from './character/swordman';
import { Vector, Rectangle, Asset, SpellType, Level, Tile } from './model';
import { CollisionDetection } from './collision/collisionDetection';
import { Gravity } from './forces/gravity';
import { TextRenderer } from './text/textRenderer';
import { Observable } from 'rxjs';
import { Editor } from './editor/editor';
import { AnimationHandler } from './handler/animationHandler';
import { ProjectileHandler } from './handler/projectileHandler';
import { ParticleHandler } from './handler/particleHandler';
import { SimpleParticleRenderer } from './render/simpleParticleRenderer';
import { SimpleParticleRenderCall } from './render/simpleParticleRenderCall';
import { DebugHandler } from './handler/debugHandler';
import { EnemyHandler } from './handler/enemyHandler';
import { LevelData, EnemyType } from './map/model';
import { Camera } from './camera';
import { Archer } from './character/archer';

export class Game {
	public canvasWidth = 1200;
	public canvasHeight = 800;
	public context: Context;

	private fps = 60;
	private tileMap: TileMap;
	private renderer: Renderer;
	private particelRenderer: ParticleRenderer;
	private simpleParticleRenderer: SimpleParticleRenderer;
	private collision: CollisionDetection = CollisionDetection.getInstance();
	private player: Player;
	private leftKeyPress: boolean;
	private rightKeyPress: boolean;
	private jumpKeyPress: boolean;
	private channelingKeyPress: boolean;
	private frostKeyPress: boolean;
	private fireKeyPress: boolean;
	private spellType: SpellType;
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
	private enemyHandler: EnemyHandler;
	private particleHandler: ParticleHandler;
	private debugHandler = DebugHandler.getInstance();
	private camera: Camera;
	private mouseRenderCall: RenderCall;
	private levelCompleted = false;

	constructor(private asset: Asset, startElement: HTMLElement, restartElement: HTMLElement, canvas: HTMLCanvasElement, levelData: LevelData) {

		this.startElement = startElement;
		this.restartElement = restartElement;
		this.levelData = levelData;

		this.context = new Context(asset, this.canvasWidth, this.canvasHeight, canvas);
		this.camera = new Camera(new Vector(0, 0), new Vector(this.canvasWidth, this.canvasHeight));
		this.renderer = new Renderer(this.context);
		this.particelRenderer = new ParticleRenderer(this.context, this.particleHandler);
		this.simpleParticleRenderer = new SimpleParticleRenderer(this.context);

		this.particleHandler = new ParticleHandler(this.levelData.tiles);
		this.animationHandler = new AnimationHandler(this.particleHandler);
		this.projectileHandler = new ProjectileHandler(this.animationHandler);
		
		this.enemyHandler = new EnemyHandler(this.context, this.projectileHandler, this.animationHandler, this.particleHandler);
		this.tileMap = new TileMap(this.context);

		this.textRenderer = new TextRenderer(this.context);
		this.initKeyBindings();
		this.initLoop();
		this.reset(this.levelData, null);
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
				this.debugHandler.debugRects = [];

				if (this.started) {
					if (!this.player.dead && !this.levelCompleted) {
						this.checkGoal();
						this.checkKeys(delta);
						this.collision.checkCoutOfBounds(this.player, this.levelData.gameSize);
						let collisionData = this.collision.collisionDetection(this.level.tiles, this.player);
						this.player.update(collisionData, delta, this.spellType);
						this.enemyHandler.update(delta, this.level.tiles, this.player);
						this.animationHandler.update(delta);
						this.projectileHandler.update(delta, this.level.tiles, this.player);
						this.camera.update(this.player.position);
					} else {
						this.animationHandler.update(delta);
						this.projectileHandler.update(delta, this.level.tiles, this.player);
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
		let renderCall = new RenderCall();
		let renderCalls: RenderCall[] = [];

		let simpleRenderCalls: SimpleParticleRenderCall[] = [];

		//EDITOR
		if (!this.started) {
			if (this.mouseRenderCall) {
				renderCalls.push(this.mouseRenderCall);
			}
		}

		//GAME
		this.enemyHandler.createRenderCall(renderCall, this.camera.position);
		this.tileMap.createRenderCall(this.level.tiles, renderCall, this.camera.position);
		this.tileMap.createGoalRenderCall(this.level.goal, renderCall, this.camera.position);

		if (this.player.dead) {
			this.textRenderer.createTextRenderCall(400, 64, 50, renderCall);
		} else if(this.levelCompleted) {
			this.textRenderer.createTextRenderCall(800, 96, 51, renderCall);
		} else {
			renderCall = this.player.createRenderCall(renderCall, this.camera.position)
		}

		this.animationHandler.createRenderCall(renderCall, this.camera.position)
		simpleRenderCalls = this.particleHandler.createRenderCalls(simpleRenderCalls, this.camera.position);

		renderCalls.push(renderCall);

		this.debugHandler.createRenderCall(renderCall, this.camera.position);
		this.renderer.render(renderCalls);
		this.simpleParticleRenderer.render(simpleRenderCalls);
		//this.particelRenderer.render(this.particleHandler.getParticleRenderCalls());
	}

	private checkGoal() {
		this.levelCompleted = this.collision.aabbCheck(this.player.getCollisionArea(), this.level.goal);
	}

	private checkKeys(delta: number) {
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
		} else {
			this.player.cancelCast();
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
					this.channelingKeyPress = false;
					break;
				case 'Numpad2':
					this.channelingKeyPress = false;
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

		let tiles: Tile[] = JSON.parse(JSON.stringify(levelData.tiles));

		this.camera.position = new Vector(levelData.cameraPosition.x, levelData.cameraPosition.y);
		this.level.tiles = tiles;
		this.level.gameSize = levelData.gameSize;
		this.level.playerPosition = new Vector(levelData.playerPosition.x, levelData.playerPosition.y);
		this.level.goal = new Rectangle(levelData.goal.x, levelData.goal.y, levelData.goal.width, levelData.goal.height);

		this.animationHandler.animations = [];
		this.projectileHandler.clear();
		this.levelCompleted = false;

		let enemies: Enemy[] = [];

		for (let enemyData of levelData.enemies) {
			if (enemyData.type == EnemyType.swordman) {
				enemies.push(new Swordman(new Vector(enemyData.area.x, enemyData.area.y), enemyData.area.width, enemyData.area.height, this.projectileHandler, this.animationHandler));
			}
		}

		this.enemyHandler.enemies = enemies;
		this.enemyHandler.enemies.push(new Archer(new Vector(600, 1250), 50, 50, this.projectileHandler, this.animationHandler));
		this.enemyHandler.enemies.push(new Archer(new Vector(600, 1100), 50, 50, this.projectileHandler, this.animationHandler));
		this.enemyHandler.enemies.push(new Archer(new Vector(600, 950), 50, 50, this.projectileHandler, this.animationHandler));
		this.player = new Player(new Vector(this.level.playerPosition.x, this.level.playerPosition.y), this.context, this.projectileHandler, this.animationHandler, this.particleHandler, 45, 45);
		this.collision.createGrid(this.level.gameSize, this.level.tiles);

	}
}