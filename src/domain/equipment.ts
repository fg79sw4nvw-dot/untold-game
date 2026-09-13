import type { PocketCard, PocketEntry } from "./inventory";

export type EquipmentSlot = "wear" | "utility-1" | "utility-2";
export type EquipmentCard = PocketCard & { category: "equipment"; equipmentSlot: "wear" | "utility" };
export type Equipped = Partial<Record<EquipmentSlot, EquipmentCard>>;

export function equip(inventory: readonly PocketEntry[], equipped: Equipped, instanceId: string, slot: EquipmentSlot): { inventory: PocketEntry[]; equipped: Equipped } {
  const candidate = inventory.find((entry): entry is EquipmentCard => entry.category === "equipment" && "instanceId" in entry && "equipmentSlot" in entry && entry.instanceId === instanceId);
  if (!candidate) return { inventory: [...inventory], equipped: { ...equipped } };
  if ((slot === "wear") !== (candidate.equipmentSlot === "wear")) return { inventory: [...inventory], equipped: { ...equipped } };
  const nextInventory = inventory.filter(entry => !("instanceId" in entry) || entry.instanceId !== instanceId);
  const replaced = equipped[slot];
  if (replaced) nextInventory.push(replaced);
  return { inventory: nextInventory, equipped: { ...equipped, [slot]: candidate } };
}

export function unequip(inventory: readonly PocketEntry[], equipped: Equipped, slot: EquipmentSlot): { inventory: PocketEntry[]; equipped: Equipped; blocked: boolean } {
  const card = equipped[slot];
  if (!card) return { inventory: [...inventory], equipped: { ...equipped }, blocked: false };
  if (inventory.length >= 180) return { inventory: [...inventory], equipped: { ...equipped }, blocked: true };
  const nextEquipped = { ...equipped }; delete nextEquipped[slot];
  return { inventory: [...inventory, card], equipped: nextEquipped, blocked: false };
}
