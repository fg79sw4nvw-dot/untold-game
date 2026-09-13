import { describe, expect, it } from "vitest";
import { ProgressState } from "../domain/progress";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { EldIntroFlow } from "./eld-intro";
import { resolveTransition, type MapTransition } from "./map-transitions";

describe("Eld library intro transition integration", () => {
  it("blocks the library exit transition until No.01 is acquired", () => {
    const progress = new ProgressState();
    const cards = new SpecifiedCardCollection();
    const flow = new EldIntroFlow(progress, cards);

    const exit: MapTransition = {
      id: "library-exit-test",
      fromMapId: "library-test",
      trigger: { x: 0, y: 0, width: 64, height: 64 },
      toMapId: "eld-test",
      spawn: [0, 96],
      gate: () => flow.attemptLibraryExit(),
    };

    flow.markBookAcquired();
    expect(resolveTransition("library-test", [32, 32], [exit]).status).toBe("blocked");

    flow.inspectBookmarkLight();
    expect(resolveTransition("library-test", [32, 32], [exit]).status).toBe("allowed");
  });
});
