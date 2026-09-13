import type { Point } from "../data/world";

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TransitionGateResult = {
  allowed: boolean;
  message?: string;
};

export type MapTransition = {
  id: string;
  fromMapId: string;
  trigger: Rect;
  toMapId: string;
  spawn: Point;
  gate?: () => TransitionGateResult;
};

export type TransitionResolution =
  | { status: "none" }
  | { status: "blocked"; transition: MapTransition; message?: string }
  | { status: "allowed"; transition: MapTransition };

export function pointInRect(point: Point, rect: Rect): boolean {
  const [x, y] = point;
  return x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height;
}

export function resolveTransition(
  currentMapId: string,
  footCenter: Point,
  transitions: readonly MapTransition[],
): TransitionResolution {
  const transition = transitions.find(
    item => item.fromMapId === currentMapId && pointInRect(footCenter, item.trigger),
  );
  if (!transition) return { status: "none" };
  const gate = transition.gate?.() ?? { allowed: true };
  if (!gate.allowed) return { status: "blocked", transition, message: gate.message };
  return { status: "allowed", transition };
}
