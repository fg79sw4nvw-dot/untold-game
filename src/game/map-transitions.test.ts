import { describe, expect, it } from "vitest";
import { resolveTransition, type MapTransition } from "./map-transitions";

describe("confirmed map transition rules", () => {
  const base: MapTransition = {
    id: "door",
    fromMapId: "outside",
    trigger: { x: 100, y: 200, width: 64, height: 32 },
    toMapId: "inside",
    spawn: [320, 448],
  };

  it("uses the player's foot center and transitions automatically inside the trigger", () => {
    expect(resolveTransition("outside", [132, 216], [base])).toEqual({ status: "allowed", transition: base });
    expect(resolveTransition("outside", [99, 216], [base])).toEqual({ status: "none" });
  });

  it("supports conditionally blocked entrances and exits", () => {
    const blocked: MapTransition = {
      ...base,
      gate: () => ({ allowed: false, message: "blocked" }),
    };
    const result = resolveTransition("outside", [132, 216], [blocked]);
    expect(result.status).toBe("blocked");
    if (result.status === "blocked") expect(result.message).toBe("blocked");
  });

  it("ignores a trigger belonging to another current map", () => {
    expect(resolveTransition("inside", [132, 216], [base])).toEqual({ status: "none" });
  });
});
