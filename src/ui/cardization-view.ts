import type { SpecifiedCardDefinition } from "../data/specified-card-definitions";
import { createSpecifiedCardElement } from "./specified-card";

export class CardizationView {
  private readonly overlay: HTMLDivElement;

  constructor(host: HTMLElement = document.body) {
    this.overlay = document.createElement("div");
    this.overlay.className = "cardization-overlay";
    this.overlay.hidden = true;
    host.append(this.overlay);
  }

  show(definition: SpecifiedCardDefinition): void {
    this.overlay.replaceChildren(createSpecifiedCardElement(definition, "cardization"));
    this.overlay.hidden = false;
    requestAnimationFrame(() => this.overlay.classList.add("cardization-overlay--visible"));
  }

  hide(): void {
    this.overlay.classList.remove("cardization-overlay--visible");
    this.overlay.hidden = true;
    this.overlay.replaceChildren();
  }
}
