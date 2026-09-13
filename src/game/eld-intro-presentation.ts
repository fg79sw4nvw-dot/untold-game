import type { SpecifiedCardDefinition } from "../data/specified-card-definitions";
import { EldIntroFlow } from "./eld-intro";

export type CardizationPresenter = {
  show(definition: SpecifiedCardDefinition): void;
};

export class EldIntroPresentation {
  constructor(
    private readonly flow: EldIntroFlow,
    private readonly presenter: CardizationPresenter,
  ) {}

  inspectBookmarkLight(): boolean {
    const definition = this.flow.acquireBookmark();
    if (!definition) return false;
    this.presenter.show(definition);
    return true;
  }
}
