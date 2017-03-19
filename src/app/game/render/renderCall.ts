import { Context } from '../';

export class RenderCall {
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