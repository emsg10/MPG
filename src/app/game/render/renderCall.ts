import { Context } from '../';
import { TextureType } from '../model';

export class RenderCall {
	public vertecies: number[];
	public textureCoords: number[];
	public indecies: number[];
	public color: number[];
	public rotation: number[];

	constructor() {
		this.vertecies = [];
		this.indecies = [];
		this.textureCoords = [];
		this.color = [];
		this.rotation = [];
	}
}