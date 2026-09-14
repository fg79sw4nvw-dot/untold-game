import { OPENING_MONOLOGUE } from "../data/opening-sequence";

export class OpeningCinematicView {
  private readonly root: HTMLDivElement;
  private readonly text: HTMLParagraphElement;

  constructor(host: HTMLElement = document.body) {
    this.root = document.createElement("div");
    this.root.className = "opening-cinematic";
    this.root.hidden = true;
    this.root.setAttribute("aria-live", "polite");

    this.text = document.createElement("p");
    this.text.className = "opening-cinematic__text";
    this.root.append(this.text);
    host.append(this.root);
  }

  get lineCount(): number {
    return OPENING_MONOLOGUE.length;
  }

  showLine(index: number): boolean {
    const line = OPENING_MONOLOGUE[index];
    if (line === undefined) return false;
    this.text.textContent = line;
    this.root.hidden = false;
    return true;
  }

  hide(): void {
    this.root.hidden = true;
    this.text.textContent = "";
  }
}
