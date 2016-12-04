import { Context, TileMap, Render } from './';
import { RenderCall } from './render/renderCall';
import { Editor } from './editor/editor';
import { Player } from './player/player';
import { Vector } from '../model';

export class Game
{
	private fps = 60;
	private context: Context = new Context();
	private tileMap: TileMap = new TileMap();
	private render: Render;
	private renderCalls: RenderCall[] = [];
	private editor: Editor = new Editor();
	private player: Player;
	private leftKeyPress: boolean;
	private rightKeyPress: boolean;

	constructor() {
		var doneLoading = this.context.doneListener();
		var tileEdited = this.editor.tileEdited().subscribe(() => {});

		doneLoading.subscribe(() => {
			this.render = new Render();
			this.start();
		});

		this.context.init(1200, 800);
		this.editor.init(25, 25, this.context.canvas);
		this.tileMap.create(this.context, this.editor.tiles);
		this.player = new Player(new Vector(200, 600), this.context);
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
	      		
	      		if(this.leftKeyPress) {
	      			this.player.moveLeft();
	      		}

	      		if(this.rightKeyPress) {
	      			this.player.moveRight();
	      		}

	      		this.player.update();

	      		this.renderCalls = [];
	      		if(this.editor.doneLoading) {
	      			this.renderCalls.push(this.editor.createRenderCall());
	      		}

				this.renderCalls.push(this.tileMap.createRenderCall(this.editor.tiles));
				this.renderCalls.push(this.player.createRenderCall());

	      		nextGameTick += skipTicks;
	      		loops++;
	    	}
	    
	    	if(loops) {

				this.render.render(this.renderCalls);
	    	} 
  		};
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
		    }

		});
	}
}