export const CONTENT_SCHEMA_VERSION = 1 as const;

export const CONTENT_KINDS = [
  "specifiedCard",
  "npc",
  "dialogue",
  "truth",
  "info",
  "observation",
  "question",
  "inference",
  "quest",
  "event",
  "location",
  "region",
  "item",
  "equipment",
  "spell",
  "recipe",
  "clue",
  "hidden",
  "open",
] as const;

export type ContentKind = typeof CONTENT_KINDS[number];
export type StableContentId = string;

export type ContentRef<K extends ContentKind = ContentKind> = Readonly<{
  kind: K;
  id: StableContentId;
}>;

export type ReferenceBinding = Readonly<{
  role: string;
  target: ContentRef;
}>;

export type ContentDefinition<K extends ContentKind = ContentKind> = Readonly<{
  schemaVersion: typeof CONTENT_SCHEMA_VERSION;
  kind: K;
  id: StableContentId;
  refs: readonly ReferenceBinding[];
}>;

export type InformationNodeKind = "truth" | "info" | "observation" | "question" | "inference";
export type InformationEdgeKind = "raises" | "supports" | "contradicts" | "resolves" | "recontextualizes";
export type SupportStrength = "weak" | "normal" | "strong";

export type InformationEdge = Readonly<{
  type: InformationEdgeKind;
  from: ContentRef<InformationNodeKind>;
  to: ContentRef<InformationNodeKind>;
  strength?: SupportStrength;
  required?: boolean;
}>;

export type KnowledgeState = "knows" | "partial" | "suspects" | "mistaken" | "unknown";
export type DisclosureStance = "open" | "guarded" | "concealed";

export type Presence<T> =
  | Readonly<{ status: "unset" }>
  | Readonly<{ status: "none" }>
  | Readonly<{ status: "present"; value: T }>;

export type CardInformationPlacement = "A" | "B" | "C" | "conditional" | "event";

export type CardInformationEntry = Readonly<{
  cardNumber: number;
  informationRefs: readonly ContentRef<"info" | "observation" | "inference">[];
  dialogueRefs: readonly ContentRef<"dialogue">[];
  placement: CardInformationPlacement;
  recordable: boolean;
  knowledgeState: KnowledgeState;
  source: string;
}>;

export type ForeshadowingEntry = Readonly<{
  targetRefs: readonly ContentRef<"clue" | "hidden" | "open">[];
  knowledgeState: KnowledgeState;
  source: string;
}>;

export type NpcInformationProfile = Readonly<{
  cardInformation: Presence<readonly CardInformationEntry[]>;
  foreshadowing: Presence<readonly ForeshadowingEntry[]>;
}>;

export function contentRef<K extends ContentKind>(kind: K, id: StableContentId): ContentRef<K> {
  if (!id.trim()) throw new Error(`Content id must not be empty for ${kind}`);
  return { kind, id };
}

export function specifiedCardRef(cardNumber: number): ContentRef<"specifiedCard"> {
  if (!Number.isInteger(cardNumber) || cardNumber < 0 || cardNumber > 99) {
    throw new Error(`Specified card number must be an integer from 0 to 99: ${cardNumber}`);
  }
  return contentRef("specifiedCard", String(cardNumber));
}

function refKey(ref: ContentRef): string {
  return `${ref.kind}:${ref.id}`;
}

export class ContentRegistry {
  private readonly definitions = new Map<string, ContentDefinition>();

  constructor(definitions: readonly ContentDefinition[] = []) {
    for (const definition of definitions) this.add(definition);
  }

  add(definition: ContentDefinition): void {
    if (!definition.id.trim()) throw new Error(`Content id must not be empty for ${definition.kind}`);
    const key = refKey(definition);
    if (this.definitions.has(key)) throw new Error(`Duplicate content definition: ${key}`);
    this.definitions.set(key, definition);
  }

  has(ref: ContentRef): boolean {
    return this.definitions.has(refKey(ref));
  }

  get<K extends ContentKind>(ref: ContentRef<K>): ContentDefinition<K> | undefined {
    return this.definitions.get(refKey(ref)) as ContentDefinition<K> | undefined;
  }

  unresolvedReferences(): ReferenceBinding[] {
    const unresolved: ReferenceBinding[] = [];
    for (const definition of this.definitions.values()) {
      for (const binding of definition.refs) {
        if (!this.has(binding.target)) unresolved.push(binding);
      }
    }
    return unresolved;
  }
}
