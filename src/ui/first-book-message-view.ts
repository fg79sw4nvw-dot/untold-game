import { GAME_MASTER_FIRST_MESSAGE } from "../data/opening-sequence";

type DialogueLine = Readonly<{
  speaker: string | null;
  text: string;
}>;

export class FirstBookMessageView {
  private readonly root: HTMLDivElement;
  private readonly book: HTMLElement;
  private readonly dialogue: HTMLDivElement;
  private readonly dialogueSpeaker: HTMLDivElement;
  private readonly dialogueText: HTMLDivElement;

  constructor(host: HTMLElement = document.body) {
    this.root = document.createElement("div");
    this.root.className = "first-book-message";
    this.root.hidden = true;

    this.book = document.createElement("section");
    this.book.className = "first-book-message__book";
    this.root.append(this.book);

    this.dialogue = document.createElement("div");
    this.dialogue.className = "opening-dialogue first-book-message__dialogue";
    this.dialogue.hidden = true;

    this.dialogueSpeaker = document.createElement("div");
    this.dialogueSpeaker.className = "opening-dialogue__speaker";

    this.dialogueText = document.createElement("div");
    this.dialogueText.className = "opening-dialogue__text";

    this.dialogue.append(this.dialogueSpeaker, this.dialogueText);
    this.root.append(this.dialogue);
    host.append(this.root);
  }

  showClosedBook(): void {
    this.root.hidden = false;
    this.dialogue.hidden = true;
    this.book.className = "first-book-message__book first-book-message__book--closed";
    this.book.replaceChildren();
    this.book.setAttribute("aria-label", "閉じたBOOK");
  }

  showTitleSpread(): void {
    this.root.hidden = false;
    this.dialogue.hidden = true;
    this.book.className = "first-book-message__book first-book-message__spread";
    this.book.setAttribute("aria-label", "UNTOLD タイトルページの見開き");

    const leftPage = document.createElement("div");
    leftPage.className = "first-book-message__page first-book-message__page--blank";
    leftPage.setAttribute("aria-label", "番号のない空白ページ");

    const rightPage = document.createElement("div");
    rightPage.className = "first-book-message__page first-book-message__page--title";

    const title = document.createElement("div");
    title.className = "first-book-message__title";
    title.textContent = "UNTOLD";
    rightPage.append(title);

    this.book.replaceChildren(leftPage, rightPage);
  }

  async showThought(text: string): Promise<void> {
    await this.showLine({ speaker: null, text });
  }

  showGameMasterSpread(): void {
    this.root.hidden = false;
    this.dialogue.hidden = true;
    this.book.className = "first-book-message__book first-book-message__spread";
    this.book.setAttribute("aria-label", "2ページから3ページの見開き");

    const text = document.createElement("div");
    text.className = "first-book-message__text";
    for (const paragraph of GAME_MASTER_FIRST_MESSAGE) {
      const p = document.createElement("p");
      p.textContent = paragraph;
      text.append(p);
    }

    this.book.replaceChildren(text);
  }

  async waitForDismissAfterLock(lockMs: number): Promise<void> {
    await new Promise<void>(resolve => window.setTimeout(resolve, lockMs));

    await new Promise<void>(resolve => {
      const dismiss = (): void => {
        this.root.removeEventListener("pointerup", dismiss);
        resolve();
      };
      this.root.addEventListener("pointerup", dismiss, { once: true });
    });
  }

  hide(): void {
    this.root.hidden = true;
    this.dialogue.hidden = true;
  }

  private async showLine(line: DialogueLine): Promise<void> {
    this.dialogueSpeaker.textContent = line.speaker ?? "";
    this.dialogueSpeaker.hidden = line.speaker === null;
    this.dialogueText.textContent = line.text;
    this.dialogue.hidden = false;

    await new Promise<void>(resolve => {
      const advance = (): void => {
        this.root.removeEventListener("pointerup", advance);
        resolve();
      };
      this.root.addEventListener("pointerup", advance, { once: true });
    });

    this.dialogue.hidden = true;
  }
}
