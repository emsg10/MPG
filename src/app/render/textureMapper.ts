import { Vector, Rectangle } from '../../model';

export class TextureMapper {

	public mapTexture(textureType: number) {
		switch(textureType) {
			case 1: return new Rectangle(0, 0, 51.2, 51.2);
			case 2: return new Rectangle(51.2, 0, 51.2, 51.2);
			case 3: return new Rectangle(102.4, 0, 51.2, 51.2);
			case 4: return new Rectangle(153.6, 0, 51.2, 51.2);
			case 5: return new Rectangle(204.8, 0, 51.2, 51.2);
			case 6: return new Rectangle(0, 51.2, 51.2, 51.2);
			case 7: return new Rectangle(51.2, 51.2, 51.2, 51.2);
			case 8: return new Rectangle(102.4, 51.2, 51.2, 51.2);
			case 9: return new Rectangle(153.6, 51.2, 51.2, 51.2);
			case 10: return new Rectangle(204.8, 51.2, 51.2, 51.2);
			case 11: return new Rectangle(0, 102.4, 51.2, 51.2);
			case 12: return new Rectangle(51.2, 102.4, 51.2, 51.2);
			case 13: return new Rectangle(102.4, 102.4, 51.2, 51.2);
			case 14: return new Rectangle(153.6, 102.4, 51.2, 51.2);
			case 15: return new Rectangle(204.8, 102.4, 51.2, 51.2);
			case 16: return new Rectangle(0, 153.6, 51.2, 51.2);
			case 17: return new Rectangle(51.2, 153.6, 51.2, 51.2);
			case 18: return new Rectangle(102.4, 153.6, 51.2, 51.2);
			case 19: return new Rectangle(153.6, 153.6, 51.2, 51.2);
			case 20: return new Rectangle(204.8, 153.6, 51.2, 51.2);
			case 21: return new Rectangle(0, 204.8, 51.2, 51.2);
			case 22: return new Rectangle(51.2, 204.8, 51.2, 51.2);
			case 23: return new Rectangle(102.4, 204.8, 51.2, 51.2);
			case 24: return new Rectangle(153.6, 204.8, 51.2, 51.2);
			case 25: return new Rectangle(204.8, 204.8, 51.2, 51.2);
			case 50: return new Rectangle(0, 368, 126, 20);	
		}
	}

}