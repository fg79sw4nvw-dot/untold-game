import { GAME_MASTER_FIRST_MESSAGE } from "../data/opening-sequence";

export class FirstBookMessageView {
  private readonly root: HTMLDivElement;

  constructor(host: HTMLElement = document.body) {
    this.root = document.createElement("div");
    this.root.className = "first-book-message";
    this.root.hidden = true;

    const book = document.createElement("section");
    book.className = "first-book-message__spread";
    book.setAttribute("aria-label", "開いた本の見開き");

    const text = document.createElement("div");
    text.className = "first-book-message__text";
    for (const paragraph of GAME_MASTER_FIRST_MESSAGE) {
      const p = document.createElement("p");
      p.textContent = paragraph;
      text.append(p);
    }

    book.append(text);
    this.root.append(book);
    host.append(this.root);
  }

  show(): void {
    this.root.hidden = false;
  }

  hide(): void {
    this.root.hidden = true;
  }
}
