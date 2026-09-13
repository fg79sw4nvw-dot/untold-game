import type { SpecifiedCardDefinition } from "../data/specified-card-definitions";

export type SpecifiedCardMode = "book" | "cardization";

export function createSpecifiedCardElement(definition: SpecifiedCardDefinition, mode: SpecifiedCardMode = "book"): HTMLElement {
  const card = document.createElement("article");
  card.className = "specified-card specified-card--" + mode;
  card.dataset.cardNumber = String(definition.number);

  const number = document.createElement("div");
  number.className = "specified-card__number";
  number.textContent = "No." + String(definition.number).padStart(2, "0");

  const name = document.createElement("div");
  name.className = "specified-card__name";
  name.textContent = definition.name;

  const illustration = document.createElement("img");
  illustration.className = "specified-card__illustration";
  illustration.src = definition.illustrationUrl;
  illustration.alt = "";

  const description = document.createElement("div");
  description.className = "specified-card__description";
  description.textContent = definition.description;

  card.append(number, name, illustration, description);
  return card;
}

export function createUnacquiredSpecifiedSlot(numberValue: number): HTMLElement {
  const slot = document.createElement("div");
  slot.className = "specified-slot specified-slot--unacquired";
  slot.textContent = "No." + String(numberValue).padStart(2, "0");
  return slot;
}
