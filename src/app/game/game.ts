import { Context, TileMap, Render } from './';
import { RenderCall } from './render/renderCall';
import { Player } from './player/player';
import { Vector, Rectangle, Asset, Level } from './model';
import { CollisionDetection } from './collision/collisionDetection';
import { Gravity } from './forces/gravity';
import { TextRenderer } from './text/textRenderer';
import { Observable } from 'rxjs';
import { Editor } from './editor/editor';

export class Game
{
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
	private level: Level;
	private editor: Editor;

	constructor(private asset: Asset, startElement: HTMLElement, canvas: HTMLCanvasElement, level: Level, editor?: Editor) {
		this.startElement = startElement;
		this.level = level;
		this.editor = editor;

		this.context = new Context(asset, 1200, 800, canvas);

		this.tileMap = new TileMap(this.context);
		this.player = new Player(this.level.playerPosition, this.context, 45, 45);
		this.textRenderer = new TextRenderer(this.context);
		this.start();		
	}

	private start() {
		this.initKeyBindings();
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

	      		if(!this.started) {
					if(this.editor) {
						this.renderCalls.push(this.editor.createRenderCall());
					}
	      		} else {
	      			this.collision.checkDeath(this.player, this.gameArea);
	      			let collisionData = this.collision.collisionDetection(this.level.tiles, this.player);
	      			this.checkKeys(delta);
	      			this.player.update(collisionData, delta);
	      		}

	      		nextGameTick += skipTicks;
	      		loops++;
	    	}
	    
	    	if(loops) {
	    		this.context.clear();

	    		//EDITOR
	    		this.renderCalls.push(this.tileMap.createRenderCall([this.editor.currentTile]));
	    		this.renderCalls.push(this.editor.preview.createRenderCall());

	    		//Game
	    		if(this.player.dead) {
	    			this.renderCalls.push(this.textRenderer.createTextRenderCall(400, 64, 50));
	    			clearInterval(this.intevalTimer);
	    		}
	    		
				this.renderCalls.push(this.tileMap.createRenderCall(this.level.tiles));
				this.renderCalls.push(this.player.createRenderCall());
				this.render.render(this.renderCalls);
	    	} 
  		};
	}

	private checkKeys(delta: number) {
		if(this.leftKeyPress) {
			this.player.moveLeft(delta);
		}

		if(this.rightKeyPress) {
			this.player.moveRight(delta);
		}

		if(this.jumpKeyPress) {
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

	}
}