import { BRIDGES, WORLD } from "../data/world";

export class PassabilityMask {
  private readonly canvas = document.createElement("canvas");
  private context: CanvasRenderingContext2D | null = null;

  async load(source: string): Promise<void> {
    const image = new Image();
    image.src = source;
    await image.decode();
    this.canvas.width = WORLD.width / WORLD.maskScale;
    this.canvas.height = WORLD.height / WORLD.maskScale;
    this.context = this.canvas.getContext("2d", { willReadFrequently: true });
    if (!this.context) throw new Error("Passability canvas is unavailable");
    this.context.imageSmoothingEnabled = false;
    this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
  }

  isWalkable(worldX: number, worldY: number): boolean {
    if (!this.context || worldX < 0 || worldY < 0 || worldX >= WORLD.width || worldY >= WORLD.height) return false;
    if (BRIDGES.some(bridge => this.isOnBridge(worldX, worldY, bridge))) return true;
    const pixel = this.context.getImageData(Math.floor(worldX / WORLD.maskScale), Math.floor(worldY / WORLD.maskScale), 1, 1).data;
    return pixel[0] > 127 && pixel[1] > 127 && pixel[2] > 127;
  }

  private isOnBridge(x: number, y: number, bridge: (typeof BRIDGES)[number]): boolean {
    const radians = bridge.angleDegrees * Math.PI / 180;
    const dx = x - bridge.center[0], dy = y - bridge.center[1];
    const along = dx * Math.cos(radians) + dy * Math.sin(radians);
    const across = -dx * Math.sin(radians) + dy * Math.cos(radians);
    return Math.abs(along) <= bridge.length / 2 && Math.abs(across) <= bridge.passableWidth / 2;
  }
}
