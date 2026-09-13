export const FREE_POCKET_CAPACITY = 180;
export const MATERIAL_STACK_LIMIT = 99;
export const FREE_POCKET_CATEGORIES = ["spell", "food", "equipment", "event", "other", "material", "valuable"] as const;
export type FreePocketCategory = typeof FREE_POCKET_CATEGORIES[number];

export type PocketCard = { instanceId: string; definitionId: string; category: Exclude<FreePocketCategory, "material"> };
export type MaterialStack = { definitionId: string; category: "material"; quantity: number };
export type PocketEntry = PocketCard | MaterialStack;
export type AddResult = { inventory: PocketEntry[]; added: number; discarded: number; needsSpace: boolean };

export function usedSlots(inventory: readonly PocketEntry[]): number { return inventory.length; }

export function addCard(inventory: readonly PocketEntry[], card: PocketCard): AddResult {
  if (usedSlots(inventory) >= FREE_POCKET_CAPACITY) return { inventory: [...inventory], added: 0, discarded: 0, needsSpace: true };
  return { inventory: [...inventory, card], added: 1, discarded: 0, needsSpace: false };
}

export function addMaterial(inventory: readonly PocketEntry[], definitionId: string, quantity: number): AddResult {
  const next = inventory.map(entry => ({ ...entry })) as PocketEntry[];
  const existing = next.find((entry): entry is MaterialStack => entry.category === "material" && entry.definitionId === definitionId);
  if (existing) {
    const available = MATERIAL_STACK_LIMIT - existing.quantity;
    const added = Math.max(0, Math.min(quantity, available));
    existing.quantity += added;
    return { inventory: next, added, discarded: Math.max(0, quantity - added), needsSpace: false };
  }
  if (usedSlots(next) >= FREE_POCKET_CAPACITY) return { inventory: next, added: 0, discarded: 0, needsSpace: true };
  const added = Math.max(0, Math.min(quantity, MATERIAL_STACK_LIMIT));
  next.push({ definitionId, category: "material", quantity: added });
  return { inventory: next, added, discarded: Math.max(0, quantity - added), needsSpace: false };
}
