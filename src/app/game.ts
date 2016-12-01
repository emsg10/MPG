import { Context, TileMap, Render } from './'
import { RenderCall } from './render/renderCall';
import { Editor } from './editor/editor';

export class Game
{
	private fps = 8;
	private context: Context = new Context();
	private tileMap: TileMap = new TileMap();
	private render: Render;
	private renderCalls: RenderCall[] = [];
	private editor: Editor = new Editor();

	constructor() {
		var doneLoading = this.context.doneListener();
		var tileEdited = this.editor.tileEdited();

		doneLoading.subscribe(() => {
			this.render = new Render(this.context);
			this.start();
		});

		tileEdited.subscribe(() => {
			this.reRender();
		});

		this.context.init();
		this.editor.init(20, 20, this.context.canvas);
		this.tileMap.create(this.context.canvas.width, this.context.canvas.height, this.editor.tiles);


	}

	private reRender() {
		var call = this.tileMap.createRenderCall(this.editor.tiles);
		call.texture = this.context.texture;
		this.renderCalls.push(call);
		this.render.render(this.renderCalls);
	}

	private start() {
		this.tileMap.renderCall.texture = this.context.texture;
		this.renderCalls.push(this.tileMap.renderCall);
		this.render.render(this.renderCalls);
		
		
		//setInterval(this.run(), (1000/this.fps));
	}

	private run() {
		var loops = 0, skipTicks = 1000 / this.fps,
      	maxFrameSkip = 10,
      	nextGameTick = (new Date).getTime();
  
  		return () => {
	    	loops = 0;
	    
	    	while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
	      		//Todo gamelogic update
	      		
	      		nextGameTick += skipTicks;
	      		loops++;
	    	}
	    
	    	if(loops) {
	    		//this.tileMap.render(this.context);	
	    	} 
  		};
	}
}