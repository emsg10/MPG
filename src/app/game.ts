import { Context, TileMap } from './'

export class Game
{
	private fps = 8;
	private context: Context;
	private tileMap: TileMap;

	constructor() {

		this.context = new Context();
		
		var doneLoading = this.context.doneListener();

		doneLoading.subscribe(() => {
			this.start();
		});

		this.context.init();

		this.tileMap = new TileMap(this.context.canvas.width, this.context.canvas.height);
		this.tileMap.create();
	}

	private start() {
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
	      		
	      		nextGameTick += skipTicks;
	      		loops++;
	    	}
	    
	    	if(loops) {
	    		this.tileMap.render(this.context);	
	    	} 
  		};
	}
}