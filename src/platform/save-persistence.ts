export interface SavePersistence {
  read(saveId: string): Promise<string | null>;
  write(saveId: string, serializedSave: string): Promise<void>;
  remove(saveId: string): Promise<void>;
}
