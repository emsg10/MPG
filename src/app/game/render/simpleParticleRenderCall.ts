import { SpellType, TextureType } from '../model';

export class SimpleParticleRenderCall {
   public vertecies: number[];
   public pointSize: number[];
   public color: number[];
   public itemCount: number;
   public textureType: TextureType;

   constructor() {
       this.vertecies = [];
       this.pointSize = [];
       this.color = [];
       this.itemCount = 0;
       this.textureType = TextureType.particleTexture;
   }
}