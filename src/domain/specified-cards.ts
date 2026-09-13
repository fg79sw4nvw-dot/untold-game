export class SpecifiedCardCollection {
  private readonly acquired = new Set<number>();

  has(cardNo: number): boolean {
    return this.acquired.has(cardNo);
  }

  acquire(cardNo: number): boolean {
    if (cardNo < 1 || cardNo > 99 || this.acquired.has(cardNo)) return false;
    this.acquired.add(cardNo);
    return true;
  }

  values(): number[] {
    return [...this.acquired].sort((a, b) => a - b);
  }
}
