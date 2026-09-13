export const WORLD = { width: 16000, height: 10000, stepPx: 32, playerSpeedPxPerSecond: 110, collisionWidthPx: 32, spriteWidthPx: 44, maskScale: 4 } as const;

export type Point = readonly [number, number];
export type Town = { id: string; name: string; position: Point };

// Only towns whose implementation coordinates are explicitly normalized in the Wiki.
export const TOWNS: readonly Town[] = [
  { id: "caldrant", name: "カルドラント", position: [8000, 2000] },
  { id: "nemeria", name: "ネメリア", position: [5200, 3800] },
  { id: "eld", name: "エルド", position: [8000, 4200] },
  { id: "auros", name: "アウロス", position: [10700, 3700] },
  { id: "vernoc", name: "ヴェルノク", position: [8400, 6000] },
  { id: "nerem", name: "ネレム", position: [6000, 6100] },
  { id: "morgrey", name: "モルグレイ", position: [11200, 6100] },
  { id: "saveria", name: "サヴェリア", position: [14600, 5800] }
] as const;

export const ROADS: readonly { id: string; points: readonly Point[] }[] = [
  { id: "nemeria-eld", points: [[5200,3800],[5600,3950],[6000,4050],[6400,4120],[6600,4200],[7000,4250],[7500,4280],[8000,4200]] },
  { id: "nerem-vernoc", points: [[6000,6100],[6150,6200],[6350,6250],[6550,6300],[6660,6330],[6800,6250],[7200,6150],[7800,6050],[8400,6000]] },
  { id: "nerem-maresta", points: [[6000,6100],[5800,6300],[5500,6900],[5400,7300],[5500,7500],[6000,7700],[6400,7750],[6900,7700],[7500,7600],[8000,7575],[8500,7550]] },
  { id: "caldrant-eld-m01", points: [[8000,2000],[7800,2050],[7600,2200],[7600,2350],[7750,2400],[8300,2390],[8400,2500],[8400,2800],[8100,2870],[7650,2950],[7500,3000],[7500,3200],[7800,3700],[8000,4200]] }
] as const;

export const BRIDGES = [
  { id: "major-bridge-1", center: [6518,4167] as Point, length: 170, passableWidth: 96, visualWidthRange: [100,110] as Point, angleDegrees: 22 },
  { id: "major-bridge-2", center: [6654,6309] as Point, length: 165, passableWidth: 96, visualWidthRange: [100,110] as Point, angleDegrees: -6 },
  { id: "major-bridge-3", center: [7559,7600] as Point, length: 284, passableWidth: 96, visualWidthRange: [100,110] as Point, angleDegrees: -4 }
] as const;
