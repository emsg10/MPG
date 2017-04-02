import { Context } from '../';
import { TextureType } from '../model';

export class DynamicRenderCall {
	public vertecies: number[];
	public textureCoords: number[];
	public indecies: number[];
	public matrices: number[];

	constructor() {
		this.vertecies = [];
		this.indecies = [];
		this.textureCoords = [];
		this.matrices = [];
	}
}