export type DialogueSentence = {
  id: string;
  text: string;
  clueIds: string[];
};

export type ConversationSession = {
  npcId: string;
  sentences: DialogueSentence[];
};

export class ConversationHistory {
  private current: ConversationSession | null = null;

  open(npcId: string): ConversationSession {
    if (!this.current || this.current.npcId !== npcId) {
      this.current = { npcId, sentences: [] };
    }
    return this.snapshot();
  }

  close(): ConversationSession | null {
    return this.current ? this.snapshot() : null;
  }

  append(npcId: string, sentences: readonly DialogueSentence[]): ConversationSession {
    this.open(npcId);
    const existingTexts = new Set(this.current!.sentences.map(sentence => sentence.text));
    for (const sentence of sentences) {
      if (existingTexts.has(sentence.text)) continue;
      this.current!.sentences.push({ ...sentence, clueIds: [...sentence.clueIds] });
      existingTexts.add(sentence.text);
    }
    return this.snapshot();
  }

  getLastSession(): ConversationSession | null {
    return this.current ? this.snapshot() : null;
  }

  private snapshot(): ConversationSession {
    return {
      npcId: this.current!.npcId,
      sentences: this.current!.sentences.map(sentence => ({ ...sentence, clueIds: [...sentence.clueIds] })),
    };
  }
}
