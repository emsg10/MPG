import { Vector, Rectangle } from '../model';

export class TextureMapper {

	private static instance: TextureMapper = new TextureMapper();

	private texture0 = new Rectangle(0, 0, 0, 0);
	private texture1 = new Rectangle(0, 0, 51.2, 51.2);
	private texture2 = new Rectangle(51.2, 0, 51.2, 51.2);
	private texture3 = new Rectangle(102.4, 0, 51.2, 51.2);
	private texture4 = new Rectangle(153.6, 0, 51.2, 51.2);
	private texture5 = new Rectangle(204.8, 0, 51.2, 51.2);
	private texture6 = new Rectangle(0, 51.2, 51.2, 51.2);
	private texture7 = new Rectangle(51.2, 51.2, 51.2, 51.2);
	private texture8 = new Rectangle(102.4, 51.2, 51.2, 51.2);
	private texture9 = new Rectangle(153.6, 51.2, 51.2, 51.2);
	private texture10 = new Rectangle(204.8, 51.2, 51.2, 51.2);
	private texture11 = new Rectangle(0, 102.4, 51.2, 51.2);
	private texture12 = new Rectangle(51.2, 102.4, 51.2, 51.2);
	private texture13 = new Rectangle(102.4, 102.4, 51.2, 51.2);
	private texture14 = new Rectangle(153.6, 102.4, 51.2, 51.2);
	private texture15 = new Rectangle(204.8, 102.4, 51.2, 50);
	private texture16 = new Rectangle(0, 153.6, 51.2, 51.2);
	private texture17 = new Rectangle(51.2, 153.6, 51.2, 51.2);
	private texture18 = new Rectangle(102.4, 153.6, 51.2, 51.2);
	private texture19 = new Rectangle(153.6, 153.6, 50, 50);
	private texture20 = new Rectangle(204.8, 153.6, 51.2, 51.2);
	private texture21 = new Rectangle(0, 204.8, 51.2, 51.2);
	private texture22 = new Rectangle(51.2, 204.8, 51.2, 51.2);
	private texture23 = new Rectangle(102.4, 204.8, 50, 51.2);
	private texture24 = new Rectangle(153.6, 204.8, 51.2, 51.2);
	private texture25 = new Rectangle(234, 220, 20, 36);
	private texture26 = new Rectangle(128, 320, 86, 128);

	private texture50 = new Rectangle(0, 368, 128, 16);
	private texture51 = new Rectangle(32, 1280, 290, 32);
	private texture52 = new Rectangle(32, 1440, 64, 8);
	private texture53 = new Rectangle(33, 1448, 8, 8);
	private texture54 = new Rectangle(33, 1456, 8, 8);

	private texture55 = new Rectangle(384, 1024, 128, 128);
	private texture56 = new Rectangle(512, 1024, 128, 128);
	private texture57 = new Rectangle(640, 1024, 128, 128);
	private texture58 = new Rectangle(768, 1024, 128, 128);
	private texture59 = new Rectangle(896, 1024, 128, 128);

	private texture60 = new Rectangle(1760, 1248, 32, 64);
	private texture61 = new Rectangle(1792, 1248, 32, 64);
	private texture62 = new Rectangle(1824, 1248, 32, 64);
	private texture63 = new Rectangle(1856, 1248, 32, 64);

	private texture100 = new Rectangle(258, 2, 55, 50);
	private texture101 = new Rectangle(311, 2, 64, 55);
	private texture102 = new Rectangle(375, 2, 72, 64);
	private texture103 = new Rectangle(257, 64, 75, 64);
	private texture104 = new Rectangle(336, 64, 78, 72);
	private texture105 = new Rectangle(416, 64, 82, 75);
	private texture106 = new Rectangle(256, 192, 128, 128);
	private texture107 = new Rectangle(384, 192, 128, 128);
	private texture108 = new Rectangle(512, 192, 128, 128);
	private texture109 = new Rectangle(256, 320, 128, 128);
	private texture110 = new Rectangle(384, 320, 128, 128);
	private texture111 = new Rectangle(512, 320, 128, 128);
	private texture112 = new Rectangle(512, 0, 128, 128);
	private texture113 = new Rectangle(640, 0, 128, 128);
	private texture114 = new Rectangle(768, 0, 128, 128);
	private texture115 = new Rectangle(896, 0, 128, 128);
	private texture116 = new Rectangle(704, 128, 128, 128);
	private texture117 = new Rectangle(832, 128, 128, 128);

	private texture118 = new Rectangle(1870, 340, 85, 85);
	private texture119 = new Rectangle(1955, 340, 85, 85);
	private texture120 = new Rectangle(1700, 425, 85, 85);
	private texture121 = new Rectangle(1785, 425, 85, 85);
	private texture122 = new Rectangle(1870, 425, 85, 85);
	private texture123 = new Rectangle(1955, 425, 85, 85);
	private texture124 = new Rectangle(1700, 510, 85, 85);
	private texture125 = new Rectangle(1785, 510, 85, 85);
	private texture126 = new Rectangle(1870, 510, 85, 85);
	private texture127 = new Rectangle(1955, 510, 85, 85);
	private texture128 = new Rectangle(1700, 595, 85, 85);
	private texture129 = new Rectangle(1785, 595, 85, 85);
	private texture130 = new Rectangle(1870, 595, 85, 85);
	private texture131 = new Rectangle(1955, 595, 85, 85);
	private texture132 = new Rectangle(1700, 680, 85, 85);
	private texture133 = new Rectangle(1785, 680, 85, 85);
	private texture134 = new Rectangle(1870, 680, 85, 85);
	private texture135 = new Rectangle(1955, 680, 85, 85);

	private texture136 = new Rectangle(1700, 765, 85, 85);
	private texture137 = new Rectangle(1785, 765, 85, 85);
	private texture138 = new Rectangle(1870, 765, 85, 85);

	private texture139 = new Rectangle(1408, 448, 64, 64);
	private texture140 = new Rectangle(1472, 448, 64, 64);
	private texture141 = new Rectangle(1536, 448, 64, 64);
	private texture142 = new Rectangle(1600, 448, 64, 64);
	private texture143 = new Rectangle(1408, 512, 64, 64);
	private texture144 = new Rectangle(1472, 512, 64, 64);
	private texture145 = new Rectangle(1536, 512, 64, 64);
	private texture146 = new Rectangle(1600, 512, 64, 64);
	
	

	private texture147 = new Rectangle(0, 896, 128, 128);
	private texture148 = new Rectangle(128, 896, 128, 128);
	private texture149 = new Rectangle(256, 896, 128, 128);
	private texture150 = new Rectangle(0, 1024, 128, 128);
	private texture151 = new Rectangle(128, 1024, 128, 128);
	private texture152 = new Rectangle(256, 1024, 128, 128);

	private texture153 = new Rectangle(1408, 576, 64, 64);
	private texture154 = new Rectangle(1472, 576, 64, 64);
	private texture155 = new Rectangle(1536, 576, 64, 64);

	private texture156 = new Rectangle(32, 608, 32, 64);
	private texture157 = new Rectangle(96, 608, 32, 64);
	private texture158 = new Rectangle(160, 608, 32, 64);
	private texture159 = new Rectangle(224, 608, 32, 64);


	private texture160 = new Rectangle(1056, 1248, 32, 64);
	private texture161 = new Rectangle(1088, 1248, 32, 64);

	private texture162 = new Rectangle(992, 1248, 32, 64);
	private texture163 = new Rectangle(1024, 1248, 32, 64);

	private texture165 = new Rectangle(1152, 1248, 32, 64);
	private texture166 = new Rectangle(1184, 1248, 32, 64);
	private texture167 = new Rectangle(1216, 1248, 32, 64);
	private texture168 = new Rectangle(1280, 1248, 32, 64);
	private texture169 = new Rectangle(1312, 1248, 32, 64);

	private texture170 = new Rectangle(1344, 1248, 32, 64);
	private texture171 = new Rectangle(1376, 1248, 32, 64);
	private texture172 = new Rectangle(1408, 1248, 32, 64);
	private texture173 = new Rectangle(1472, 1248, 32, 64);
	private texture174 = new Rectangle(1504, 1248, 32, 64);
	private texture175 = new Rectangle(1536, 1248, 32, 64);
	private texture176 = new Rectangle(1568, 1248, 32, 64);
	private texture177 = new Rectangle(1600, 1248, 32, 64);
	private texture178 = new Rectangle(1632, 1248, 32, 64);

	private texture179 = new Rectangle(1248, 32, 164, 27);
	private texture180 = new Rectangle(1248, 96, 32, 32);
	private texture181 = new Rectangle(1248, 64, 164, 27);
	private texture182 = new Rectangle(1248, 0, 164, 27);
	private texture183 = new Rectangle(1440, 0, 164, 27);
	private texture184 = new Rectangle(1440, 32, 164, 27);
	private texture185 = new Rectangle(1440, 64, 164, 27);
	private texture186 = new Rectangle(1440, 96, 164, 27);

	private texture187 = new Rectangle(1088, 96, 128, 64);

	private texture188 = new Rectangle(1088, 192, 128, 64);
	private texture189 = new Rectangle(1088, 256, 128, 64);
	private texture190 = new Rectangle(1088, 320, 128, 64);
	private texture191 = new Rectangle(1088, 384, 128, 64);
	private texture192 = new Rectangle(1088, 448, 128, 64);
	private texture193 = new Rectangle(1088, 512, 128, 64);
	private texture194 = new Rectangle(1088, 576, 128, 64);
	private texture195 = new Rectangle(1088, 640, 128, 64);
	private texture196 = new Rectangle(1088, 704, 128, 64);
	private texture197 = new Rectangle(1088, 768, 128, 64);

	private texture198 = new Rectangle(1632, 0, 270, 64);

	private texture199 = new Rectangle(64, 1664, 128, 128);


	private texture200 = new Rectangle(28, 293, 28, 26);
	private texture201 = new Rectangle(56, 293, 28, 26);
	private texture202 = new Rectangle(84, 293, 28, 26);
	private texture203 = new Rectangle(0, 290, 28, 29);
	private texture204 = new Rectangle(112, 290, 28, 29);
	private texture205 = new Rectangle(140, 290, 28, 29);
	private texture206 = new Rectangle(168, 290, 28, 29);
	private texture207 = new Rectangle(196, 290, 28, 29);
	private texture208 = new Rectangle(224, 290, 28, 29);

	private texture209 = new Rectangle(0, 480, 28, 29);
	private texture210 = new Rectangle(28, 480, 28, 29);
	private texture211 = new Rectangle(56, 480, 28, 29);
	private texture212 = new Rectangle(84, 480, 28, 29);

	private texture214 = new Rectangle(0, 448, 28, 29);
	private texture215 = new Rectangle(28, 448, 28, 29);
	private texture216 = new Rectangle(56, 448, 28, 29);
	private texture217 = new Rectangle(84, 448, 28, 29);
	private texture218 = new Rectangle(112, 448, 28, 29);
	private texture219 = new Rectangle(140, 448, 28, 29);

	private texture220 = new Rectangle(0, 416, 28, 29);
	private texture221 = new Rectangle(28, 416, 28, 29);
	private texture222 = new Rectangle(56, 416, 28, 29);
	private texture223 = new Rectangle(84, 416, 28, 29);

	private texture224 = new Rectangle(0, 384, 28, 29);
	private texture225 = new Rectangle(28, 384, 28, 29);
	private texture226 = new Rectangle(56, 384, 28, 29);

	private texture227 = new Rectangle(112, 480, 28, 29);
	private texture228 = new Rectangle(140, 480, 28, 29);
	private texture229 = new Rectangle(168, 480, 28, 29);

	private texture230 = new Rectangle(196, 480, 28, 29);
	private texture231 = new Rectangle(224, 480, 28, 29);
	private texture232 = new Rectangle(252, 480, 28, 29);

	private texture233 = new Rectangle(32, 1152, 32, 32);
	private texture234 = new Rectangle(64, 1152, 32, 32);
	private texture235 = new Rectangle(96, 1152, 32, 32);
	private texture236 = new Rectangle(128, 1152, 32, 32);

	private texture237 = new Rectangle(160, 1152, 32, 32);
	private texture238 = new Rectangle(192, 1152, 32, 32);
	private texture239 = new Rectangle(224, 1152, 32, 32);
	private texture240 = new Rectangle(256, 1152, 32, 32);
	private texture241 = new Rectangle(288, 1152, 32, 32);
	private texture242 = new Rectangle(320, 1152, 32, 32);

	private texture243 = new Rectangle(32, 1216, 32, 32);
	private texture244 = new Rectangle(64, 1216, 32, 32);
	private texture245 = new Rectangle(96, 1216, 32, 32);
	private texture246 = new Rectangle(128, 1216, 32, 32);
	private texture247 = new Rectangle(160, 1216, 32, 32);
	private texture248 = new Rectangle(192, 1216, 32, 32);

	private texture249 = new Rectangle(0, 320, 28, 32);

	private texture250 = new Rectangle(224, 1216, 32, 32);
	private texture251 = new Rectangle(256, 1216, 32, 32);
	private texture252 = new Rectangle(288, 1216, 32, 32);
	private texture253 = new Rectangle(320, 1216, 32, 32);
	private texture254 = new Rectangle(352, 1216, 32, 32);
	private texture255 = new Rectangle(384, 1216, 32, 32);
	private texture256 = new Rectangle(416, 1216, 32, 32);
	private texture257 = new Rectangle(448, 1216, 32, 32);

	private texture262 = new Rectangle(32, 1344, 32, 32);
	private texture263 = new Rectangle(64, 1344, 32, 32);
	private texture264 = new Rectangle(96, 1344, 32, 32);
	private texture265 = new Rectangle(160, 1344, 32, 32);
	private texture266 = new Rectangle(192, 1344, 32, 32);
	private texture267 = new Rectangle(224, 1344, 32, 32);

	private texture268 = new Rectangle(32, 1401, 24, 7);
	private texture269 = new Rectangle(64, 1401, 15, 7);

	private texture270 = new Rectangle(288, 1344, 32, 32);
	private texture271 = new Rectangle(320, 1344, 32, 32);
	private texture272 = new Rectangle(352, 1344, 32, 32);
	private texture273 = new Rectangle(384, 1344, 32, 32);
	private texture274 = new Rectangle(416, 1344, 32, 32);
	private texture275 = new Rectangle(448, 1344, 32, 32);

	private texture276 = new Rectangle(288, 1376, 32, 32);
	private texture277 = new Rectangle(320, 1376, 32, 32);
	private texture278 = new Rectangle(352, 1376, 32, 32);
	private texture279 = new Rectangle(384, 1376, 32, 32);
	private texture280 = new Rectangle(416, 1376, 32, 32);
	private texture281 = new Rectangle(448, 1376, 32, 32);

	private texture282 = new Rectangle(512, 1344, 32, 32);
	private texture283 = new Rectangle(544, 1344, 32, 32);
	private texture284 = new Rectangle(576, 1344, 32, 32);
	private texture285 = new Rectangle(608, 1344, 32, 32);
	private texture286 = new Rectangle(640, 1344, 32, 32);
	private texture287 = new Rectangle(672, 1344, 32, 32);
	private texture288 = new Rectangle(704, 1344, 32, 32);
	private texture289 = new Rectangle(736, 1344, 32, 32);

	private texture290 = new Rectangle(800, 1344, 32, 32);
	private texture291 = new Rectangle(832, 1344, 32, 32);
	private texture292 = new Rectangle(864, 1344, 32, 32);
	private texture293 = new Rectangle(896, 1344, 32, 32);

	private texture294 = new Rectangle(480, 1376, 28, 32);
	private texture295 = new Rectangle(512, 1376, 28, 32);
	private texture296 = new Rectangle(544, 1376, 28, 32);

	private texture297 = new Rectangle(480, 1440, 20, 20);
	private texture298 = new Rectangle(512, 1440, 20, 20);
	private texture299 = new Rectangle(544, 1440, 20, 20);

	private texture300 = new Rectangle(32, 1664, 128, 128);

	private texture301 = new Rectangle(1344, 1184, 64, 64);
	private texture302 = new Rectangle(1408, 1184, 64, 64);
	private texture303 = new Rectangle(1472, 1184, 64, 64);
	private texture304 = new Rectangle(1536, 1184, 64, 64);
	private texture305 = new Rectangle(1600, 1184, 64, 64);
	private texture306 = new Rectangle(1664, 1184, 64, 64);



	private texture500 = new Rectangle(0, 1536, 96, 64);

	private texture550 = new Rectangle(1088, 0, 128, 64);
	private texture551 = new Rectangle(1632, 96, 111, 12);
	private texture552 = new Rectangle(1632, 128, 111, 12);

	private texture553 = new Rectangle(1440, 128, 164, 27);

	private texture554 = new Rectangle(1248, 128, 164, 27);

	private texture555 = new Rectangle(1440, 160, 164, 27);
	private texture556 = new Rectangle(1440, 192, 164, 27);
	private texture557 = new Rectangle(1440, 224, 164, 27);
	private texture558 = new Rectangle(1440, 256, 164, 27);

	private texture560 = new Rectangle(1344, 704, 64, 96);
	private texture561 = new Rectangle(1408, 704, 64, 96);
	private texture562 = new Rectangle(1472, 704, 64, 96);
	private texture563 = new Rectangle(1536, 704, 64, 96);
	private texture564 = new Rectangle(1600, 704, 64, 96);
	private texture565 = new Rectangle(1344, 800, 64, 96);
	private texture566 = new Rectangle(1408, 800, 64, 96);
	private texture567 = new Rectangle(1472, 800, 64, 96);

	private texture568 = new Rectangle(1536, 800, 64, 96);
	private texture569 = new Rectangle(1600, 800, 64, 96);
	private texture570 = new Rectangle(1344, 896, 64, 96);
	private texture571 = new Rectangle(1408, 896, 64, 96);
	private texture572 = new Rectangle(1472, 896, 64, 96);
	private texture573 = new Rectangle(1536, 896, 64, 96);
	private texture574 = new Rectangle(1600, 896, 64, 96);
	private texture575 = new Rectangle(1344, 992, 64, 96);
	private texture576 = new Rectangle(1408, 992, 64, 96);
	private texture577 = new Rectangle(1472, 992, 64, 96);
	private texture578 = new Rectangle(1536, 992, 64, 96);
	private texture579 = new Rectangle(1600, 992, 64, 96);

	constrcuctor() {
		if (TextureMapper.instance) {
			throw new Error("Static class cant be instanced!");
		}

		TextureMapper.instance = this;
	}

	public static getInstance() {
		return TextureMapper.instance;
	}



	public mapTexture(textureType: number) {

		switch (textureType) {
			case 0: return this.texture0;
			case 1: return this.texture1;
			case 2: return this.texture2;
			case 3: return this.texture3;
			case 4: return this.texture4;
			case 5: return this.texture5;
			case 6: return this.texture6;
			case 7: return this.texture7;
			case 8: return this.texture8;
			case 9: return this.texture9;
			case 10: return this.texture10;
			case 11: return this.texture11;
			case 12: return this.texture12;
			case 13: return this.texture13;
			case 14: return this.texture14;
			case 15: return this.texture15;
			case 16: return this.texture16;
			case 17: return this.texture17;
			case 18: return this.texture18;
			case 19: return this.texture19;
			case 20: return this.texture20;
			case 21: return this.texture21;
			case 22: return this.texture22;
			case 23: return this.texture23;
			case 24: return this.texture24;
			case 25: return this.texture25;
			case 26: return this.texture26;

			case 50: return this.texture50;
			case 51: return this.texture51;
			case 52: return this.texture52;
			case 53: return this.texture53;
			case 54: return this.texture54;

			case 55: return this.texture55;
			case 56: return this.texture56;
			case 57: return this.texture57;
			case 58: return this.texture58;
			case 59: return this.texture59;

			case 60: return this.texture60;
			case 61: return this.texture61;
			case 62: return this.texture62;			
			case 63: return this.texture63;

			case 100: return this.texture100;
			case 101: return this.texture101;
			case 102: return this.texture102;
			case 103: return this.texture103;
			case 104: return this.texture104;
			case 105: return this.texture105;
			case 106: return this.texture106;
			case 107: return this.texture107;
			case 108: return this.texture108;
			case 109: return this.texture109;
			case 110: return this.texture110;
			case 111: return this.texture111;
			case 112: return this.texture112;
			case 113: return this.texture113;
			case 114: return this.texture114;
			case 115: return this.texture115;
			case 116: return this.texture116;
			case 117: return this.texture117;
			case 118: return this.texture118;
			case 119: return this.texture119;
			case 120: return this.texture120;
			case 121: return this.texture121;
			case 122: return this.texture122;
			case 123: return this.texture123;
			case 124: return this.texture124;
			case 125: return this.texture125;
			case 126: return this.texture126;
			case 127: return this.texture127;
			case 128: return this.texture128;
			case 129: return this.texture129;
			case 130: return this.texture130;
			case 131: return this.texture131;
			case 132: return this.texture132;
			case 133: return this.texture133;
			case 134: return this.texture134;
			case 135: return this.texture135;

			case 136: return this.texture136;
			case 137: return this.texture137;
			case 138: return this.texture138;

			case 139: return this.texture139;
			case 140: return this.texture140;
			case 141: return this.texture141;
			case 142: return this.texture142;
			case 143: return this.texture143;
			case 144: return this.texture144;
			case 145: return this.texture145;
			case 146: return this.texture146;

			case 147: return this.texture147;
			case 148: return this.texture148;
			case 149: return this.texture149;
			case 150: return this.texture150;
			case 151: return this.texture151;
			case 152: return this.texture152;

			case 153: return this.texture153;
			case 154: return this.texture154;
			case 155: return this.texture155;

			case 156: return this.texture156;
			case 157: return this.texture157;
			case 158: return this.texture158;
			case 159: return this.texture159;

			case 160: return this.texture160;
			case 161: return this.texture161;

			case 162: return this.texture162;
			case 163: return this.texture163;

			case 165: return this.texture165;
			case 166: return this.texture166;
			case 167: return this.texture167;
			case 168: return this.texture168;
			case 169: return this.texture169;

			case 170: return this.texture170;
			case 171: return this.texture171;
			case 172: return this.texture172;
			case 173: return this.texture173;
			case 174: return this.texture174;
			case 175: return this.texture175;
			case 176: return this.texture176;
			case 177: return this.texture177;
			case 178: return this.texture178;
			case 179: return this.texture179;
			case 180: return this.texture180;

			case 181: return this.texture181;
			case 182: return this.texture182;
			case 183: return this.texture183;
			case 184: return this.texture184;
			case 185: return this.texture185;
			case 186: return this.texture186;
			case 187: return this.texture187;
			case 188: return this.texture188;
			case 189: return this.texture189;
			case 190: return this.texture190;
			case 191: return this.texture191;
			case 192: return this.texture192;
			case 193: return this.texture193;
			case 194: return this.texture194;
			case 195: return this.texture195;
			case 196: return this.texture196;
			case 197: return this.texture197;

			case 198: return this.texture198;
			case 199: return this.texture199;


			case 200: return this.texture200;
			case 201: return this.texture201;
			case 202: return this.texture202;
			case 203: return this.texture203;
			case 204: return this.texture204;
			case 205: return this.texture205;
			case 206: return this.texture206;
			case 207: return this.texture207;
			case 208: return this.texture208;

			case 209: return this.texture209;
			case 210: return this.texture210;
			case 211: return this.texture211;
			case 212: return this.texture212;

			case 214: return this.texture214;
			case 215: return this.texture215;
			case 216: return this.texture216;
			case 217: return this.texture217;
			case 218: return this.texture218;
			case 219: return this.texture219;

			case 220: return this.texture220;
			case 221: return this.texture221;
			case 222: return this.texture222;
			case 223: return this.texture223;

			case 224: return this.texture224;
			case 225: return this.texture225;
			case 226: return this.texture226;

			case 227: return this.texture227;
			case 228: return this.texture228;
			case 229: return this.texture229;

			case 230: return this.texture230;
			case 231: return this.texture231;
			case 232: return this.texture232;

			case 233: return this.texture233;
			case 234: return this.texture234;
			case 235: return this.texture235;
			case 236: return this.texture236;

			case 237: return this.texture237;
			case 238: return this.texture238;
			case 239: return this.texture239;
			case 240: return this.texture240;
			case 241: return this.texture241;
			case 242: return this.texture242;

			case 243: return this.texture243;
			case 244: return this.texture244;
			case 245: return this.texture245;
			case 246: return this.texture246;
			case 247: return this.texture247;
			case 248: return this.texture248;

			case 249: return this.texture249;

			case 250: return this.texture250;
			case 251: return this.texture251;
			case 252: return this.texture252;
			case 253: return this.texture253;
			case 254: return this.texture254;
			case 255: return this.texture255;
			case 256: return this.texture256;
			case 257: return this.texture257;

			case 262: return this.texture262;
			case 263: return this.texture263;
			case 264: return this.texture264;
			case 265: return this.texture265;
			case 266: return this.texture266;
			case 267: return this.texture267;

			case 268: return this.texture268;
			case 269: return this.texture269;

			case 270: return this.texture270;
			case 271: return this.texture271;
			case 272: return this.texture272;
			case 273: return this.texture273;
			case 274: return this.texture274;
			case 275: return this.texture275;

			case 276: return this.texture276;
			case 277: return this.texture277;
			case 278: return this.texture278;
			case 279: return this.texture279;
			case 280: return this.texture280;
			case 281: return this.texture281;

			case 282: return this.texture282;
			case 283: return this.texture283;
			case 284: return this.texture284;
			case 285: return this.texture285;
			case 286: return this.texture286;
			case 287: return this.texture287;
			case 288: return this.texture288;
			case 289: return this.texture289;

			case 290: return this.texture290;
			case 291: return this.texture291;
			case 292: return this.texture292;
			case 293: return this.texture293;

			case 294: return this.texture294;
			case 295: return this.texture295;
			case 296: return this.texture296;

			case 297: return this.texture297;
			case 298: return this.texture298;
			case 299: return this.texture299;

			case 300: return this.texture300;

			case 301: return this.texture301;
			case 302: return this.texture302;
			case 303: return this.texture303;
			case 304: return this.texture304;
			case 305: return this.texture305;
			case 306: return this.texture306;

			case 500: return this.texture500;

			case 550: return this.texture550;
			case 551: return this.texture551;
			case 552: return this.texture552;

			case 553: return this.texture553;
			case 554: return this.texture554;

			case 555: return this.texture555;
			case 556: return this.texture556;
			case 557: return this.texture557;
			case 558: return this.texture558;

			case 560: return this.texture560;
			case 561: return this.texture561;
			case 562: return this.texture562;
			case 563: return this.texture563;
			case 564: return this.texture564;
			case 565: return this.texture565;
			case 566: return this.texture566;
			case 567: return this.texture567;
			case 568: return this.texture568;
			case 569: return this.texture569;
			case 570: return this.texture570;
			case 571: return this.texture571;
			case 572: return this.texture572;
			case 573: return this.texture573;
			case 574: return this.texture574;
			case 575: return this.texture575;

			case 576: return this.texture576;
			case 577: return this.texture577;
			case 578: return this.texture578;
			case 579: return this.texture579;

		}
	}

}