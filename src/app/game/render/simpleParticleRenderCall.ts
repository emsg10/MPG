import { SpellType } from '../model';

export class SimpleParticleRenderCall {
   public vertecies: number[];
   public pointSize: number[];
   public color: number[];
   public itemCount: number;

   constructor() {
       this.vertecies = [];
       this.pointSize = [];
       this.color = [];
       this.itemCount = 0;
   }
}