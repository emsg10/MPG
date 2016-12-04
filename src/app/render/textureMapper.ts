import { Vector } from '../../model';

export class TextureMapper {

	public mapTexture(textureType: number) {
		switch(textureType) {
			case 1: return new Vector(0, 0);
			case 2: return new Vector(1, 0);
			case 3: return new Vector(2, 0);
			case 4: return new Vector(3, 0);
			case 5: return new Vector(4, 0);
			case 6: return new Vector(0, 1);
			case 7: return new Vector(1, 1);
			case 8: return new Vector(2, 1);
			case 9: return new Vector(3, 1);
			case 10: return new Vector(4, 1);
			case 11: return new Vector(0, 2);
			case 12: return new Vector(1, 2);
			case 13: return new Vector(2, 2);
			case 14: return new Vector(3, 2);
			case 15: return new Vector(4, 2);
			case 16: return new Vector(0, 3);
			case 17: return new Vector(1, 3);
			case 18: return new Vector(2, 3);
			case 19: return new Vector(3, 3);
			case 20: return new Vector(4, 3);
			case 21: return new Vector(0, 4);
			case 22: return new Vector(1, 4);
			case 23: return new Vector(2, 4);
			case 24: return new Vector(3, 4);
			case 25: return new Vector(4, 4);
		}
	}

}