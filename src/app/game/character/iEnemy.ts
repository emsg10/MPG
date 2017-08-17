import { Tile, Vector, Animation, Rectangle, SpellType } from '../model';
import { Player } from "./index";
import { DeathType } from "./deathType";

export interface IEnemy {

    inverse: boolean;
    position: Vector;
    toMove: Vector;
    width: number;
    height: number;

    dead: boolean;
    burnValue: number;
    deathType: DeathType;

    currentAnimation: Animation;
    color: number[];

    update(delta: number, tiles: Tile[], player: Player): void;
    getCollisionArea(): Rectangle;
    takeDamage(damage: number, type: SpellType): void;
    freeze(): void;
    burn(): void;
}