import { Context } from '../';
import { TextureType } from '../model';

export class ColorRenderCall {
	public vertecies: number[];
	public textureCoords: number[];
	public indecies: number[];
	public color: number[];

	constructor() {
		this.vertecies = [];
		this.indecies = [];
		this.textureCoords = [];
		this.color = [];
	}
}