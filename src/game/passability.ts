import { BRIDGES, WORLD } from "../data/world";

export type PassabilityRaster = Readonly<{
  width: number;
  height: number;
  rgba: Uint8ClampedArray;
}>;

export interface WorldPassability {
  isWalkable(worldX: number, worldY: number): boolean;
}

export class PassabilityMask implements WorldPassability {
  constructor(private readonly raster: PassabilityRaster) {}

  isWalkable(worldX: number, worldY: number): boolean {
    if (worldX < 0 || worldY < 0 || worldX >= WORLD.width || worldY >= WORLD.height) {
      return false;
    }
    if (BRIDGES.some(bridge => this.isOnBridge(worldX, worldY, bridge))) return true;

    const pixelX = Math.floor(worldX / WORLD.maskScale);
    const pixelY = Math.floor(worldY / WORLD.maskScale);
    if (pixelX < 0 || pixelY < 0 || pixelX >= this.raster.width || pixelY >= this.raster.height) {
      return false;
    }

    const index = (pixelY * this.raster.width + pixelX) * 4;
    const red = this.raster.rgba[index] ?? 0;
    const green = this.raster.rgba[index + 1] ?? 0;
    const blue = this.raster.rgba[index + 2] ?? 0;
    return red > 127 && green > 127 && blue > 127;
  }

  private isOnBridge(x: number, y: number, bridge: (typeof BRIDGES)[number]): boolean {
    const radians = bridge.angleDegrees * Math.PI / 180;
    const dx = x - bridge.center[0];
    const dy = y - bridge.center[1];
    const along = dx * Math.cos(radians) + dy * Math.sin(radians);
    const across = -dx * Math.sin(radians) + dy * Math.cos(radians);
    return Math.abs(along) <= bridge.length / 2 && Math.abs(across) <= bridge.passableWidth / 2;
  }
}
