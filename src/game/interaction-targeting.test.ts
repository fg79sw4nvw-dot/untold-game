import { describe, expect, it } from "vitest";
import {
  chooseInteractionTarget,
  rankInteractionCandidates,
} from "./interaction-targeting";

describe("interaction targeting", () => {
  it("keeps only candidates within 64px and the front 180 degrees", () => {
    const ranked = rankInteractionCandidates(
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      [
        { value: "front", position: { x: 40, y: 0 } },
        { value: "side", position: { x: 0, y: 40 } },
        { value: "back", position: { x: -40, y: 0 } },
        { value: "far", position: { x: 65, y: 0 } },
      ],
    );

    expect(ranked.map(candidate => candidate.value)).toEqual(["front", "side"]);
  });

  it("ranks the smallest facing angle first", () => {
    const ranked = rankInteractionCandidates(
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      [
        { value: "near-but-off-angle", position: { x: 20, y: 20 } },
        { value: "far-but-straight", position: { x: 60, y: 0 } },
      ],
    );

    expect(ranked[0]?.value).toBe("far-but-straight");
  });

  it("uses distance only among angles the caller treats as effectively tied", () => {
    const ranked = rankInteractionCandidates(
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      [
        { value: "straight", position: { x: 60, y: 0 } },
        { value: "near", position: { x: 30, y: 1 } },
      ],
    );

    expect(chooseInteractionTarget(ranked, 0)).toBe("straight");
    expect(chooseInteractionTarget(ranked, 0.04)).toBe("near");
  });
});
