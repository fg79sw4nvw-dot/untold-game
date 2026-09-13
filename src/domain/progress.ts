export class ProgressState {
  private readonly states = new Set<string>();

  has(id: string): boolean {
    return this.states.has(id);
  }

  set(id: string): void {
    this.states.add(id);
  }

  clear(id: string): void {
    this.states.delete(id);
  }

  values(): string[] {
    return [...this.states];
  }
}
