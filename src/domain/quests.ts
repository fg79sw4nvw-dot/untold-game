export type QuestStatus = "inactive" | "active" | "completed";

export class QuestTracker {
  private readonly states = new Map<string, QuestStatus>();

  status(id: string): QuestStatus {
    return this.states.get(id) ?? "inactive";
  }

  start(id: string): boolean {
    if (this.status(id) !== "inactive") return false;
    this.states.set(id, "active");
    return true;
  }

  complete(id: string): boolean {
    if (this.status(id) !== "active") return false;
    this.states.set(id, "completed");
    return true;
  }

  entries(): Array<[string, QuestStatus]> {
    return [...this.states.entries()];
  }
}
