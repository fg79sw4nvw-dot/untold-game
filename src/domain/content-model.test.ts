import { describe, expect, it } from "vitest";
import {
  CONTENT_SCHEMA_VERSION,
  ContentRegistry,
  contentRef,
  specifiedCardRef,
  type ContentDefinition,
  type NpcInformationProfile,
} from "./content-model";
import {
  ELD_NPC_LIBRARIAN,
  QUEST_BOOK_EATING_RAT,
  BOOK_EATING_RAT_CLUE_SENTENCES,
} from "../data/eld-content";
import { IMPLEMENTED_CONTENT_REGISTRY } from "../data/content-registry";
import { CARD_NO_BOOK_EATING_RAT } from "../data/specified-card-definitions";

describe("P0-1 shared content model", () => {
  it("resolves existing UNTOLD content through typed references", () => {
    const card55: ContentDefinition<"specifiedCard"> = {
      schemaVersion: CONTENT_SCHEMA_VERSION,
      kind: "specifiedCard",
      id: specifiedCardRef(CARD_NO_BOOK_EATING_RAT).id,
      refs: [],
    };

    const librarian: ContentDefinition<"npc"> = {
      schemaVersion: CONTENT_SCHEMA_VERSION,
      kind: "npc",
      id: ELD_NPC_LIBRARIAN,
      refs: [],
    };

    const quest: ContentDefinition<"quest"> = {
      schemaVersion: CONTENT_SCHEMA_VERSION,
      kind: "quest",
      id: QUEST_BOOK_EATING_RAT,
      refs: [
        { role: "specified-card", target: specifiedCardRef(CARD_NO_BOOK_EATING_RAT) },
        { role: "introduced-by", target: contentRef("npc", ELD_NPC_LIBRARIAN) },
      ],
    };

    const dialogue: ContentDefinition<"dialogue"> = {
      schemaVersion: CONTENT_SCHEMA_VERSION,
      kind: "dialogue",
      id: BOOK_EATING_RAT_CLUE_SENTENCES[0].id,
      refs: [
        { role: "speaker", target: contentRef("npc", ELD_NPC_LIBRARIAN) },
        { role: "quest", target: contentRef("quest", QUEST_BOOK_EATING_RAT) },
      ],
    };

    const registry = new ContentRegistry([card55, librarian, quest, dialogue]);

    expect(registry.has(specifiedCardRef(CARD_NO_BOOK_EATING_RAT))).toBe(true);
    expect(registry.has(contentRef("npc", ELD_NPC_LIBRARIAN))).toBe(true);
    expect(registry.unresolvedReferences()).toEqual([]);
  });

  it("keeps all currently registered implementation references resolvable", () => {
    expect(IMPLEMENTED_CONTENT_REGISTRY.unresolvedReferences()).toEqual([]);
  });

  it("detects missing cross-content references before content reaches runtime", () => {
    const definition: ContentDefinition<"dialogue"> = {
      schemaVersion: CONTENT_SCHEMA_VERSION,
      kind: "dialogue",
      id: "test-dialogue",
      refs: [{ role: "speaker", target: contentRef("npc", "missing-npc") }],
    };

    const registry = new ContentRegistry([definition]);
    expect(registry.unresolvedReferences()).toEqual([
      { role: "speaker", target: { kind: "npc", id: "missing-npc" } },
    ]);
  });

  it("keeps unset, none, and present NPC information states distinct", () => {
    const profile: NpcInformationProfile = {
      cardInformation: { status: "none" },
      foreshadowing: { status: "unset" },
    };

    expect(profile.cardInformation.status).toBe("none");
    expect(profile.foreshadowing.status).toBe("unset");
  });

  it("supports No.0 as a special reference without treating it as an acquired 1-99 card", () => {
    expect(specifiedCardRef(0)).toEqual({ kind: "specifiedCard", id: "0" });
    expect(specifiedCardRef(99)).toEqual({ kind: "specifiedCard", id: "99" });
    expect(() => specifiedCardRef(100)).toThrow();
  });
});
