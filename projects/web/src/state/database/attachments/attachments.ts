/**
 * A test file defining attachment types and database.
 */

import { Dexie, Table } from 'dexie';

export interface BlobDto {
  id: string
  filename: string
  mimeType: string
  size: number
  data: ArrayBuffer
}

export class BlobDatabase extends Dexie {
  blobs!: Table<BlobDto>;

  constructor() {
    super('blobs');
    this.version(1).stores({
      blobs: '&id'
    });
  }
}

export const blobDatabase = new BlobDatabase();
