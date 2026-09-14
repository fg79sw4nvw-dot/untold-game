import { describe, expect, it } from "vitest";
import { ProgressState } from "../domain/progress";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { EldIntroFlow } from "./eld-intro";
import { resolveTransition, type MapTransition } from "./map-transitions";

describe("Eld library intro transition integration", () => {
  it("blocks exit for No.01 first, then routes into the No.55 intro", () => {
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
    const afterBookmark = resolveTransition("library-test", [32, 32], [exit]);
    expect(afterBookmark.status).toBe("blocked");
    expect(flow.attemptLibraryExit().triggerBookRatIntro).toBe(true);
  });
});
