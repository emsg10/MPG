import { RenderCall, Renderer } from '../render';

export interface Scene {
    update(): void;
    render(): void;
    click(mousePosition: [number, number]): void;
}