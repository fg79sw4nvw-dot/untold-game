import { describe, expect, it } from "vitest";
import {
  centeredCameraForSmallMap,
  initialCamera,
  updateDeadZoneCamera,
} from "./dead-zone-camera";

describe("dead-zone camera", () => {
  const viewport = { width: 480, height: 800 };

  it("keeps the camera still while the player remains inside the 40% x 30% dead zone", () => {
    const map = { width: 1200, height: 1600 };
    const camera = { x: 200, y: 300 };
    expect(updateDeadZoneCamera(camera, { x: 440, y: 700 }, map, viewport)).toEqual(camera);
  });

  it("moves immediately only enough to put the player back on the dead-zone edge", () => {
    const map = { width: 1200, height: 1600 };
    const camera = { x: 200, y: 300 };
    expect(updateDeadZoneCamera(camera, { x: 600, y: 700 }, map, viewport)).toEqual({
      x: 264,
      y: 300,
    });
  });

  it("clamps the camera at map boundaries", () => {
    const map = { width: 640, height: 1024 };
    expect(initialCamera({ x: 620, y: 1000 }, map, viewport)).toEqual({ x: 160, y: 224 });
  });

  it("centers maps smaller than the viewport so outside space can be rendered black", () => {
    const smallMap = { width: 320, height: 600 };
    expect(centeredCameraForSmallMap(smallMap, viewport)).toEqual({ x: -80, y: -100 });
    expect(updateDeadZoneCamera({ x: 0, y: 0 }, { x: 160, y: 300 }, smallMap, viewport)).toEqual({
      x: -80,
      y: -100,
    });
  });
});
