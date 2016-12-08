import { Context, TileMap, Render } from './';
import { RenderCall } from './render/renderCall';
import { Editor } from './editor/editor';
import { Player } from './player/player';
import { Vector } from '../model';
import { CollisionDetection } from './collision/collisionDetection';
import { Gravity } from './forces/gravity';

export class Game
{
	private fps = 60;
	private context: Context = new Context();
	private tileMap: TileMap = new TileMap();
	private render: Render;
	private renderCalls: RenderCall[] = [];
	private editor: Editor = new Editor();
	private collision: CollisionDetection = new CollisionDetection();
	private player: Player;
	private leftKeyPress: boolean;
	private rightKeyPress: boolean;
	private jumpKeyPress: boolean;
	private tileSizeX: number = 25;
	private tileSizeY: number = 25;
	private started: boolean = false;

	constructor() {
		var doneLoading = this.context.doneListener();
		var tileEdited = this.editor.tileEdited().subscribe(() => {});

		doneLoading.subscribe(() => {
			this.render = new Render();
			this.start();
		});

		this.context.init(1200, 800);
		this.editor.init(this.tileSizeX, this.tileSizeY, this.context.canvas);
		this.tileMap.create(this.context, this.editor.tiles);
		this.player = new Player(new Vector(200, 600), this.context, 42, 50);
	}

	private start() {
		this.initKeyBindings();
		setInterval(this.run(), (1000/this.fps));
	}

	private run() {
		var loops = 0, skipTicks = 1000 / this.fps,
      	maxFrameSkip = 10,
      	nextGameTick = (new Date).getTime();
  
  		return () => {
	    	loops = 0;
	    
	    	while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
	      		//Todo gamelogic update
	      		this.renderCalls = [];

	      		if(!this.started) {
	      			if(this.editor.doneLoading) {
		      			this.renderCalls.push(this.editor.createRenderCall());
		      		}
	      			this.renderCalls.push(this.tileMap.createRenderCall(this.editor.tiles));
	      		} else {
	      			this.collision.checkPowerUps(this.player, this.tileMap, this.tileSizeX);
	      			this.checkKeys();
	      			this.collision.checkIfWallCollision(this.player, this.tileMap, this.tileSizeX);
	      			this.player.update();
		      		this.checkSolid();
	      		}

	      		nextGameTick += skipTicks;
	      		loops++;
	    	}
	    
	    	if(loops) {
	    		this.renderCalls.push(this.tileMap.createRenderCall(this.editor.tiles));
				this.renderCalls.push(this.player.createRenderCall());
				this.render.render(this.renderCalls);
	    	} 
  		};
	}

	private checkKeys() {
		if(this.leftKeyPress) {
			this.player.moveLeft();
		}

		if(this.rightKeyPress) {
			this.player.moveRight();
		}

		if(this.jumpKeyPress) {
			this.player.jump();
		}
	}

	private checkSolid() {
		var tilesToCheck = this.collision.detectPossibleCollisions(this.player.position, this.tileMap.tiles, this.tileSizeX);
		let groundCollision = this.collision.checkCollision(tilesToCheck, this.player.getCollisionArea());

		if(!groundCollision) {
			this.player.fall();
		} else {
			groundCollision = this.player.groundCollision();
		}

		let wallCollision = this.collision.checkCollision(tilesToCheck, this.player.getCollisionArea());

		if(wallCollision) {
			this.player.wallCollision();
		}

		if(groundCollision && !wallCollision) {
			this.player.resetJump();
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

		document.getElementById("start").addEventListener("click", (event: MouseEvent) => {
			this.started = true;
		});

	}
}