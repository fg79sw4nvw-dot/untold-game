export const RECORD_LIMIT = 99;
export type RecordSource = "npc" | "item" | "sign" | "observation";
export type RecordMark = 1 | 2 | 3 | 4;
export type RecordEntry = { id: string; text: string; sourceType: RecordSource; sourceId: string; locationId: string; recordedAt: string; clueIds: string[]; marks: RecordMark[] };
export type RecordGroup = { id: string; name: string; recordIds: string[] };

export class RecordBook {
  constructor(public records: RecordEntry[] = [], public groups: RecordGroup[] = []) {}
  canAdd(): boolean { return this.records.length < RECORD_LIMIT; }
  add(record: RecordEntry): boolean { if (!this.canAdd() || this.records.some(item => item.id === record.id)) return false; this.records.push({ ...record, clueIds: [...record.clueIds], marks: record.marks.slice(0, 2) }); return true; }
  replace(removeId: string, record: RecordEntry): boolean { const index = this.records.findIndex(item => item.id === removeId); if (index < 0) return false; this.delete(removeId); this.records.splice(index, 0, { ...record, clueIds: [...record.clueIds], marks: record.marks.slice(0, 2) }); return true; }
  delete(id: string): void { this.records = this.records.filter(item => item.id !== id); this.groups = this.groups.map(group => ({ ...group, recordIds: group.recordIds.filter(recordId => recordId !== id) })); }
  clueCount(clueId: string): number { return this.records.reduce((count, record) => count + Number(record.clueIds.includes(clueId)), 0); }
  search(term: string): RecordEntry[] { return this.records.filter(record => record.text.includes(term)); }
  reorder(ids: readonly string[]): void { const positions = new Map(ids.map((id, index) => [id,index])); this.records.sort((a,b)=>(positions.get(a.id) ?? Number.MAX_SAFE_INTEGER)-(positions.get(b.id) ?? Number.MAX_SAFE_INTEGER)); }
}
