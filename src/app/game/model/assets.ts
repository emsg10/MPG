import { TileAsset } from '../map/model';

export class Asset {
	public vertexShader: string;
	public fragmentShader: string;
	public simpleParticleVertexShader: string;
	public simpleParticleFragmentShader: string;
	public dynamicVertexShader: string;
	public dynamicFragmentShader: string;
	public colorVertexShader: string;
	public colorFragmentShader: string;
	public texture: HTMLImageElement;
	public particleTexture: HTMLImageElement;
	public genericParticleTexture: HTMLImageElement;
	public tileAssets: Map<number, TileAsset>;
}