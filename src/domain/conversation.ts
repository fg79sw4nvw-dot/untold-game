export type DialogueSentence = {
  id: string;
  text: string;
  clueIds: string[];
};

export type ConversationSession = {
  npcId: string;
  sentences: DialogueSentence[];
};

export type ConversationRecallState = {
  session: ConversationSession | null;
  remainingMinutes: number;
};

export const CONVERSATION_RECALL_MINUTES = 6 * 60;

export class ConversationHistory {
  private current: ConversationSession | null = null;
  private remainingMinutes = 0;

  open(npcId: string): ConversationSession {
    if (!this.current || this.current.npcId !== npcId || this.remainingMinutes <= 0) {
      this.current = { npcId, sentences: [] };
    }
    this.remainingMinutes = CONVERSATION_RECALL_MINUTES;
    return this.snapshot();
  }

  close(): ConversationSession | null {
    return this.current ? this.snapshot() : null;
  }

  append(npcId: string, sentences: readonly DialogueSentence[]): ConversationSession {
    if (!this.current || this.current.npcId !== npcId || this.remainingMinutes <= 0) {
      this.open(npcId);
    }
    const existingTexts = new Set(this.current!.sentences.map(sentence => sentence.text));
    for (const sentence of sentences) {
      if (existingTexts.has(sentence.text)) continue;
      this.current!.sentences.push({ ...sentence, clueIds: [...sentence.clueIds] });
      existingTexts.add(sentence.text);
    }
    return this.snapshot();
  }

  elapseGameMinutes(minutes: number): void {
    if (minutes <= 0 || !this.current) return;
    this.remainingMinutes = Math.max(0, this.remainingMinutes - minutes);
    if (this.remainingMinutes === 0) this.current = null;
  }

  getLastSession(): ConversationSession | null {
    return this.current ? this.snapshot() : null;
  }

  getRemainingMinutes(): number {
    return this.current ? this.remainingMinutes : 0;
  }

  saveRecallState(): ConversationRecallState {
    return {
      session: this.current ? this.snapshot() : null,
      remainingMinutes: this.current ? this.remainingMinutes : 0,
    };
  }

  restoreRecallState(state: ConversationRecallState): void {
    if (!state.session || state.remainingMinutes <= 0) {
      this.current = null;
      this.remainingMinutes = 0;
      return;
    }
    this.current = {
      npcId: state.session.npcId,
      sentences: state.session.sentences.map(sentence => ({
        ...sentence,
        clueIds: [...sentence.clueIds],
      })),
    };
    this.remainingMinutes = Math.min(state.remainingMinutes, CONVERSATION_RECALL_MINUTES);
  }

  private snapshot(): ConversationSession {
    return {
      npcId: this.current!.npcId,
      sentences: this.current!.sentences.map(sentence => ({ ...sentence, clueIds: [...sentence.clueIds] })),
    };
  }
}
