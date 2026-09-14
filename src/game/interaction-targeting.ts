import type { DirectionVector } from "./floating-field-input";

export type InteractionPoint = Readonly<{ x: number; y: number }>;
export type InteractionCandidate<T> = Readonly<{ value: T; position: InteractionPoint }>;
export type RankedInteractionCandidate<T> = Readonly<{
  value: T;
  distance: number;
  angleRadians: number;
}>;

export const INTERACTION_RANGE_PX = 64;

function normalized(vector: DirectionVector): DirectionVector {
  const length = Math.hypot(vector.x, vector.y);
  if (length === 0) return { x: 0, y: 0 };
  return { x: vector.x / length, y: vector.y / length };
}

export function rankInteractionCandidates<T>(
  player: InteractionPoint,
  facing: DirectionVector,
  candidates: readonly InteractionCandidate<T>[],
): RankedInteractionCandidate<T>[] {
  const facingUnit = normalized(facing);
  if (facingUnit.x === 0 && facingUnit.y === 0) return [];

  return candidates
    .flatMap(candidate => {
      const dx = candidate.position.x - player.x;
      const dy = candidate.position.y - player.y;
      const distance = Math.hypot(dx, dy);
      if (distance === 0) {
        return [{ value: candidate.value, distance: 0, angleRadians: 0 }];
      }
      if (distance > INTERACTION_RANGE_PX) return [];

      const targetUnit = { x: dx / distance, y: dy / distance };
      const dot = facingUnit.x * targetUnit.x + facingUnit.y * targetUnit.y;
      if (dot < 0) return [];

      const angleRadians = Math.acos(Math.max(-1, Math.min(1, dot)));
      return [{ value: candidate.value, distance, angleRadians }];
    })
    .sort((a, b) => a.angleRadians - b.angleRadians || a.distance - b.distance);
}

export function chooseInteractionTarget<T>(
  ranked: readonly RankedInteractionCandidate<T>[],
  angleTieToleranceRadians: number,
): T | null {
  const first = ranked[0];
  if (!first) return null;

  const nearAngle = ranked.filter(
    candidate => candidate.angleRadians - first.angleRadians <= angleTieToleranceRadians,
  );
  const closest = nearAngle.reduce((best, candidate) =>
    candidate.distance < best.distance ? candidate : best,
  first);
  return closest.value;
}
