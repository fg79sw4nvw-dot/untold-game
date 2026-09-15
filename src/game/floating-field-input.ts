export type ScreenPoint = Readonly<{ x: number; y: number }>;
export type DirectionVector = Readonly<{ x: number; y: number }>;

export const FIELD_MOVE_THRESHOLD_PX = 18;
export const FIELD_MOVE_SPEED_PX_PER_SECOND = 160;

export type FloatingInputUpdate =
  | { kind: "idle" }
  | { kind: "tap-candidate" }
  | { kind: "move"; direction: DirectionVector };

export type FloatingInputRelease =
  | { kind: "none" }
  | { kind: "tap" }
  | { kind: "move-end" };

function displacement(origin: ScreenPoint, point: ScreenPoint): DirectionVector {
  return { x: point.x - origin.x, y: point.y - origin.y };
}

function magnitude(vector: DirectionVector): number {
  return Math.hypot(vector.x, vector.y);
}

function normalize(vector: DirectionVector): DirectionVector {
  const length = magnitude(vector);
  if (length === 0) return { x: 0, y: 0 };
  return { x: vector.x / length, y: vector.y / length };
}

export function movementDelta(direction: DirectionVector, elapsedSeconds: number): DirectionVector {
  return {
    x: direction.x * FIELD_MOVE_SPEED_PX_PER_SECOND * elapsedSeconds,
    y: direction.y * FIELD_MOVE_SPEED_PX_PER_SECOND * elapsedSeconds,
  };
}

export class FloatingFieldInput {
  private origin: ScreenPoint | null = null;
  private moving = false;

  begin(point: ScreenPoint): FloatingInputUpdate {
    this.origin = point;
    this.moving = false;
    return { kind: "tap-candidate" };
  }

  update(point: ScreenPoint): FloatingInputUpdate {
    if (this.origin === null) return { kind: "idle" };

    const vector = displacement(this.origin, point);
    const distance = magnitude(vector);
    if (!this.moving && distance < FIELD_MOVE_THRESHOLD_PX) {
      return { kind: "tap-candidate" };
    }

    this.moving = true;
    return { kind: "move", direction: normalize(vector) };
  }

  end(point: ScreenPoint): FloatingInputRelease {
    if (this.origin === null) return { kind: "none" };

    const vector = displacement(this.origin, point);
    const wasMoving = this.moving || magnitude(vector) >= FIELD_MOVE_THRESHOLD_PX;
    this.origin = null;
    this.moving = false;
    return wasMoving ? { kind: "move-end" } : { kind: "tap" };
  }

  cancel(): void {
    this.origin = null;
    this.moving = false;
  }
}
