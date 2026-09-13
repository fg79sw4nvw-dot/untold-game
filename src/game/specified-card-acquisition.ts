import type { SpecifiedCardDefinition } from "../data/specified-card-definitions";
import { SPECIFIED_CARD_DEFINITIONS } from "../data/specified-card-definitions";
import { SpecifiedCardCollection } from "../domain/specified-cards";

export type SpecifiedCardAcquisitionResult =
  | { acquired: false; reason: "unknown-card" | "already-acquired" }
  | { acquired: true; definition: SpecifiedCardDefinition };

export class SpecifiedCardAcquisition {
  constructor(private readonly cards: SpecifiedCardCollection) {}

  acquire(cardNo: number): SpecifiedCardAcquisitionResult {
    const definition = SPECIFIED_CARD_DEFINITIONS.get(cardNo);
    if (!definition) return { acquired: false, reason: "unknown-card" };
    if (!this.cards.acquire(cardNo)) return { acquired: false, reason: "already-acquired" };
    return { acquired: true, definition };
  }
}
