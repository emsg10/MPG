import { Context } from '../context';
import { Tile } from '../../model';
import { RenderCall } from '../render/renderCall';
import { RenderHelper } from '../render/renderHelper';

export class Preview {

	public tileSizeXElement: HTMLInputElement;
	public tileSizeXTextElement: HTMLSpanElement;
	public tileSizeYElement: HTMLInputElement;
	public tileSizeYTextElement: HTMLSpanElement;
	public doneLoading: boolean = false;
	public currentTile: Tile = new Tile(0, 0, 25, 25, 1);
	private previewContext: Context = new Context();
	private renderHelper: RenderHelper = new RenderHelper();
	

	constructor() {

		let div = document.createElement("div");
		div.style.position = "absolute";
		div.style.top = "200px";
		div.style.left = "1260px";
		this.tileSizeXElement = document.createElement("input");
		this.tileSizeXElement.type = "range";
		this.tileSizeXElement.min = "10";
		this.tileSizeXElement.max = "100";
		this.tileSizeXElement.step = "5";
		this.tileSizeXElement.value = "25";
		this.tileSizeXElement.style.display = "block";
		
		this.tileSizeYElement = document.createElement("input");
		this.tileSizeYElement.type = "range";
		this.tileSizeYElement.min = "10";
		this.tileSizeYElement.max = "100";
		this.tileSizeYElement.step = "5";
		this.tileSizeYElement.value = "25";
		this.tileSizeYElement.style.display = "block";

		this.tileSizeXTextElement = document.createElement("span");
		this.tileSizeXTextElement.innerHTML = this.tileSizeXElement.value;
		this.tileSizeXTextElement.style.display = "block";

		this.tileSizeYTextElement = document.createElement("span");
		this.tileSizeYTextElement.innerHTML = this.tileSizeYElement.value;
		this.tileSizeYTextElement.style.display = "block";

		div.appendChild(this.tileSizeXElement);
		div.appendChild(this.tileSizeXTextElement);
		div.appendChild(this.tileSizeYElement);
		div.appendChild(this.tileSizeYTextElement);
		
		this.previewContext.init(150, 150, true, div);

		document.body.appendChild(div);		

		this.previewContext.doneListener().subscribe(() => {
			this.doneLoading = true;
		});

	}

	public createRenderCall() {
		let renderCall = new RenderCall();

		var vertecies: number[] = [];
		var textureCoords: number[] = [];
		var indecies: number[] = [];

		vertecies = this.renderHelper.getVertecies((75-(this.currentTile.width/2)), 75-(this.currentTile.height/2), this.currentTile.width, this.currentTile.height, vertecies);
		textureCoords = this.renderHelper.getTextureCoordinates(textureCoords, this.currentTile.tileTextureType);
		indecies = this.renderHelper.getIndecies(indecies);

		renderCall.vertecies = vertecies;
		renderCall.textureCoords = textureCoords;
		renderCall.indecies = indecies;
		renderCall.context = this.previewContext;

		return renderCall;
	}

}