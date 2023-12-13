import { Dexie, Table } from 'dexie';

export type BlobMimeType =
  "image/png" |
  "image/jpeg" |
  "image/svg" |
  "image/webp" |
  "audio/mp3" |
  "audio/m4a"

export interface BlogDto {
  id: string
  mimeType: BlobMimeType
  data: string
}

export class BlobDatabase extends Dexie {
  changes!: Table<BlogDto>;

  constructor() {
    super('blobs');
    this.version(1).stores({
      changes: '&id'
    });
  }
}

export const blobDatabase = new BlobDatabase();
