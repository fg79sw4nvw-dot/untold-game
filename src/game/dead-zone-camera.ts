export type WorldPoint = Readonly<{ x: number; y: number }>;
export type Size = Readonly<{ width: number; height: number }>;

export const CAMERA_DEAD_ZONE_WIDTH_RATIO = 0.4;
export const CAMERA_DEAD_ZONE_HEIGHT_RATIO = 0.3;

export type CameraState = Readonly<{ x: number; y: number }>;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function centeredCameraForSmallMap(map: Size, viewport: Size): CameraState {
  return {
    x: (map.width - viewport.width) / 2,
    y: (map.height - viewport.height) / 2,
  };
}

export function initialCamera(player: WorldPoint, map: Size, viewport: Size): CameraState {
  if (map.width <= viewport.width && map.height <= viewport.height) {
    return centeredCameraForSmallMap(map, viewport);
  }

  const maxX = Math.max(0, map.width - viewport.width);
  const maxY = Math.max(0, map.height - viewport.height);
  return {
    x: map.width <= viewport.width ? (map.width - viewport.width) / 2 : clamp(player.x - viewport.width / 2, 0, maxX),
    y: map.height <= viewport.height ? (map.height - viewport.height) / 2 : clamp(player.y - viewport.height / 2, 0, maxY),
  };
}

export function updateDeadZoneCamera(
  camera: CameraState,
  player: WorldPoint,
  map: Size,
  viewport: Size,
): CameraState {
  if (map.width <= viewport.width && map.height <= viewport.height) {
    return centeredCameraForSmallMap(map, viewport);
  }

  const halfDeadWidth = viewport.width * CAMERA_DEAD_ZONE_WIDTH_RATIO / 2;
  const halfDeadHeight = viewport.height * CAMERA_DEAD_ZONE_HEIGHT_RATIO / 2;
  const centerX = camera.x + viewport.width / 2;
  const centerY = camera.y + viewport.height / 2;
  let nextX = camera.x;
  let nextY = camera.y;

  if (map.width > viewport.width) {
    if (player.x < centerX - halfDeadWidth) {
      nextX = player.x - (viewport.width / 2 - halfDeadWidth);
    } else if (player.x > centerX + halfDeadWidth) {
      nextX = player.x - (viewport.width / 2 + halfDeadWidth);
    }
    nextX = clamp(nextX, 0, map.width - viewport.width);
  } else {
    nextX = (map.width - viewport.width) / 2;
  }

  if (map.height > viewport.height) {
    if (player.y < centerY - halfDeadHeight) {
      nextY = player.y - (viewport.height / 2 - halfDeadHeight);
    } else if (player.y > centerY + halfDeadHeight) {
      nextY = player.y - (viewport.height / 2 + halfDeadHeight);
    }
    nextY = clamp(nextY, 0, map.height - viewport.height);
  } else {
    nextY = (map.height - viewport.height) / 2;
  }

  return { x: nextX, y: nextY };
}
