import { SpellType } from '../model';

export class ParticleRenderCall {
    public lifetimes: number[] = [];
	public startPositions: number[] = [];
	public endPositions: number[] = [];
	public relativeTime: number[] = [];
	public length: number;
	public color: number[];
	public type: SpellType;
}