import { describe, expect, it, vi } from "vitest";
import { ProgressState } from "../domain/progress";
import { SpecifiedCardCollection } from "../domain/specified-cards";
import { EldIntroFlow } from "./eld-intro";
import { EldIntroPresentation } from "./eld-intro-presentation";

describe("Eld intro presentation", () => {
  it("shows the No.01 card only when the bookmark can actually be acquired", () => {
    const flow = new EldIntroFlow(new ProgressState(), new SpecifiedCardCollection());
    const presenter = { show: vi.fn() };
    const presentation = new EldIntroPresentation(flow, presenter);

    expect(presentation.inspectBookmarkLight()).toBe(false);
    expect(presenter.show).not.toHaveBeenCalled();

    flow.markBookAcquired();
    expect(presentation.inspectBookmarkLight()).toBe(true);
    expect(presenter.show).toHaveBeenCalledTimes(1);
    expect(presenter.show.mock.calls[0][0].number).toBe(1);
    expect(presenter.show.mock.calls[0][0].name).toBe("忘れられた栞");

    expect(presentation.inspectBookmarkLight()).toBe(false);
    expect(presenter.show).toHaveBeenCalledTimes(1);
  });
});
