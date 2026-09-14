import { describe, expect, it } from "vitest";
import { OpeningSequenceController } from "./opening-sequence-controller";

describe("confirmed opening sequence order", () => {
  it("advances only through the confirmed phase order", () => {
    const flow = new OpeningSequenceController();

    expect(flow.currentPhase()).toBe("cinematic");
    expect(flow.showFirstBookMessage()).toBe(false);

    expect(flow.enterLibraryIntro()).toBe(true);
    expect(flow.currentPhase()).toBe("library-intro");

    expect(flow.showFirstBookMessage()).toBe(true);
    expect(flow.currentPhase()).toBe("first-book-message");

    expect(flow.finishFirstBookMessage()).toBe(true);
    expect(flow.currentPhase()).toBe("after-first-book-reading");

    expect(flow.beginLibrarianReport()).toBe(true);
    expect(flow.currentPhase()).toBe("librarian-report");

    expect(flow.finishLibrarianReport()).toBe(true);
    expect(flow.currentPhase()).toBe("free-library");
  });
});
