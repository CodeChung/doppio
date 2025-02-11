import { Injectable } from '@angular/core';

interface Costume {
  id: string;
  sprite: HTMLImageElement;
  layer: number;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private baseSprite: HTMLImageElement;
  private costumes: Costume[] = [];

  constructor() {
    this.baseSprite = new Image();
    this.baseSprite.src = 'assets/base_character.png';
  }

  /** Add a costume */
  addCostume(id: string, spriteSrc: string, layer: number): void {
    const costume = new Image();
    costume.src = spriteSrc;
    this.costumes.push({ id, sprite: costume, layer });
    this.costumes.sort((a, b) => a.layer - b.layer);
  }

  /** Remove a costume */
  removeCostume(id: string): void {
    this.costumes = this.costumes.filter(costume => costume.id !== id);
  }

  /** Render Character on Canvas */
  render(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.drawImage(this.baseSprite, x, y);
    this.costumes.forEach(costume => ctx.drawImage(costume.sprite, x, y));
  }
}
