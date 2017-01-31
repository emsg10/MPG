import { Vector, Rectangle } from '../model';

export class TextureMapper {

	private static instance: TextureMapper = new TextureMapper();

	constrcuctor() {
		if(TextureMapper.instance) {
			throw new Error("Static class cant be instanced!");
		}

		TextureMapper.instance = this;
	}

	public static getInstance() {
		return TextureMapper.instance;
	}

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
			case 15: return new Rectangle(204.8, 102.4, 51.2, 50);
			case 16: return new Rectangle(0, 153.6, 51.2, 51.2);
			case 17: return new Rectangle(51.2, 153.6, 51.2, 51.2);
			case 18: return new Rectangle(102.4, 153.6, 51.2, 51.2);
			case 19: return new Rectangle(153.6, 153.6, 50, 50);
			case 20: return new Rectangle(204.8, 153.6, 51.2, 51.2);
			case 21: return new Rectangle(0, 204.8, 51.2, 51.2);
			case 22: return new Rectangle(51.2, 204.8, 51.2, 51.2);
			case 23: return new Rectangle(102.4, 204.8, 50, 51.2);
			case 24: return new Rectangle(153.6, 204.8, 51.2, 51.2);
			case 25: return new Rectangle(234, 220, 20, 36);
			case 26: return new Rectangle(128, 320, 86, 128);
			case 50: return new Rectangle(0, 368, 126, 20);
			case 100: return new Rectangle(258, 2, 55, 50);
			case 101: return new Rectangle(311, 2, 64, 55);
			case 102: return new Rectangle(375, 2, 72, 64);
			case 103: return new Rectangle(257, 64, 75, 64);
			case 104: return new Rectangle(336, 64, 78, 72);
			case 105: return new Rectangle(416, 64, 82, 75);
			case 106: return new Rectangle(256, 192, 128, 128);
			case 107: return new Rectangle(384, 192, 128, 128);
			case 108: return new Rectangle(512, 192, 128, 128);
			case 109: return new Rectangle(256, 320, 128, 128);
			case 110: return new Rectangle(384, 320, 128, 128);
			case 111: return new Rectangle(512, 320, 128, 128);
			case 112: return new Rectangle(512, 0, 128, 128);
			case 113: return new Rectangle(640, 0, 128, 128);
			case 114: return new Rectangle(768, 0, 128, 128);
			case 115: return new Rectangle(896, 0, 128, 128);
			case 116: return new Rectangle(704, 128, 128, 128);
			case 117: return new Rectangle(832, 128, 128, 128);
			case 118: return new Rectangle(0, 512, 128, 128);
			case 119: return new Rectangle(128, 512, 128, 128);
			case 120: return new Rectangle(256, 512, 128, 128);
			case 121: return new Rectangle(0, 640, 128, 128);
			case 122: return new Rectangle(128, 640, 128, 128);
			case 123: return new Rectangle(256, 640, 128, 128);
			case 124: return new Rectangle(0, 768, 128, 128);
			case 125: return new Rectangle(128, 768, 128, 128);
			case 126: return new Rectangle(256, 768, 128, 128);
			case 200: return new Rectangle(28, 293, 28, 26);
			case 201: return new Rectangle(56, 293, 28, 26);
			case 202: return new Rectangle(84, 293, 28, 26);
			case 203: return new Rectangle(0, 290, 28, 29);
			case 204: return new Rectangle(112, 290, 28, 29);
			case 205: return new Rectangle(140, 290, 28, 29);
			case 206: return new Rectangle(168, 290, 28, 29);
			case 207: return new Rectangle(196, 290, 28, 29);
			case 208: return new Rectangle(224, 290, 28, 29);
		}
	}

}