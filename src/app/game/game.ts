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
import { EnemyHandler } from './handler/enemyHandler';
import { LevelData, EnemyType } from './map/model';

export class Game {
	public canvasWidth = 1200;
	public canvasHeight = 800;
	private fps = 60;
	private context: Context;
	private tileMap: TileMap;
	private renderer: Renderer;
	private editorRenderer: Renderer;
	private previewRenderer: Renderer;
	private particelRenderer: ParticleRenderer;
	private collision: CollisionDetection = CollisionDetection.getInstance();
	private player: Player;
	private leftKeyPress: boolean;
	private rightKeyPress: boolean;
	private jumpKeyPress: boolean;
	private channelingKeyPress: boolean;
	private frostKeyPress: boolean;
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
	private editor: Editor;
	private animationHandler: AnimationHandler;
	private projectileHandler: ProjectileHandler;
	private enemyHandler: EnemyHandler;
	private particleHandler: ParticleHandler;


	constructor(private asset: Asset, startElement: HTMLElement, restartElement: HTMLElement, canvas: HTMLCanvasElement, levelData: LevelData, editor?: Editor) {
		this.startElement = startElement;
		this.restartElement = restartElement;
		this.levelData = levelData;
		this.editor = editor;

		this.context = new Context(asset, 1200, 800, canvas);
		this.renderer = new Renderer(this.context);
		this.particleHandler = new ParticleHandler();
		this.particelRenderer = new ParticleRenderer(this.context, this.particleHandler);

		this.editorRenderer = new Renderer(this.editor.context);
		this.previewRenderer = new Renderer(this.editor.preview.context);
		this.animationHandler = new AnimationHandler(this.context);
		this.projectileHandler = new ProjectileHandler(this.animationHandler);
		this.enemyHandler = new EnemyHandler(this.context, this.projectileHandler, this.animationHandler);

		this.tileMap = new TileMap(this.context);

		this.textRenderer = new TextRenderer(this.context);
		this.initKeyBindings();
		this.initLoop();
		this.reset(this.levelData);
	}

	public reset(levelData: LevelData) {
		this.loadLevel(levelData);
		this.started = false;
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
				
				if (this.started) {
					if (!this.player.dead) {
						this.checkKeys(delta);
						this.collision.checkCoutOfBounds(this.player, this.gameArea);
						let collisionData = this.collision.collisionDetection(this.level.tiles, this.player);
						this.player.update(collisionData, delta, this.spellType);
						this.enemyHandler.update(delta, this.level.tiles, this.player);
						this.animationHandler.update(delta);
						this.projectileHandler.update(delta, this.level.tiles, this.player);
					} else {
						this.animationHandler.update(delta);
						this.projectileHandler.update(delta, this.level.tiles, this.player);
					}
				}
				this.particelRenderer.updateParticleBuffers(delta, this.enemyHandler.enemies);

				this.render();

				nextGameTick += skipTicks;
			}
		};
	}

	private render() {
		this.context.clear();
		let renderCall = new RenderCall();
		renderCall.vertecies = [];
		renderCall.textureCoords = [];
		renderCall.indecies = [];
		renderCall.color = [];

		let editorRenderCall = new RenderCall();
		editorRenderCall.vertecies = [];
		editorRenderCall.textureCoords = [];
		editorRenderCall.indecies = [];
		editorRenderCall.color = [];

		let renderCalls: RenderCall[] = [];
		let editorRenderCalls: RenderCall[] = [];
		let previewRenderCalls: RenderCall[] = [];
		

		//EDITOR
		if (!this.started) {
			editorRenderCalls.push(this.editor.createRenderCall());
			if (this.editor.currentTile != null) {
				renderCalls.push(this.tileMap.createRenderCall([this.editor.currentTile], editorRenderCall));
			}
			editorRenderCalls.push(this.editor.currentEnemyRenderCall(this.context));
			previewRenderCalls.push(this.editor.preview.createRenderCall());
			editorRenderCalls.push(this.editor.createEnemyRenderCall());
		}

		//Game
		this.enemyHandler.createRenderCall(renderCall)
		this.tileMap.createRenderCall(this.level.tiles, renderCall)

		if (this.player.dead) {
			this.textRenderer.createTextRenderCall(400, 64, 50, renderCall);
			//clearInterval(this.intevalTimer);
		} else {
			renderCall = this.player.createRenderCall(renderCall)
		}

		this.animationHandler.createRenderCall(renderCall)

		renderCalls.push(renderCall);

		this.renderer.render(renderCalls);
		this.previewRenderer.render(previewRenderCalls);
		this.editorRenderer.render(editorRenderCalls);
		this.particelRenderer.render();
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

		if(this.frostKeyPress) {
			this.player.cast();
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
			this.reset(this.levelData);
		});

	}

	private loadLevel(levelData: LevelData) {
		let tiles: Tile[] = JSON.parse(JSON.stringify(levelData.tiles));
		this.level.tiles = tiles;
		this.level.playerPosition = new Vector(levelData.playerPosition.x, levelData.playerPosition.y);
		this.animationHandler.animations = [];
		this.projectileHandler.clear();

		let enemies: Enemy[] = [];

		for (let enemyData of levelData.enemies) {
			if (enemyData.type == EnemyType.swordman) {
				enemies.push(new Swordman(new Vector(enemyData.area.x, enemyData.area.y), enemyData.area.width, enemyData.area.height, this.projectileHandler, this.animationHandler));
			}
		}

		this.enemyHandler.enemies = enemies;
		this.player = new Player(new Vector(this.level.playerPosition.x, this.level.playerPosition.y), this.context, this.projectileHandler, this.animationHandler, this.particleHandler, 45, 45);

	}
}