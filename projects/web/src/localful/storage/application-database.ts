import { Dexie, Table } from 'dexie';
import {ContentEntity, VaultEntity, VersionEntity} from "@localful/common";


export class ApplicationDatabase extends Dexie {
  vaults!: Table<VaultEntity>;
  content!: Table<ContentEntity>;
  versions!: Table<VersionEntity>;

  constructor() {
    super('localful');
    this.version(1).stores({
      vaults: '&id',
      content: '&id, vaultId, type, createdAt, isDeleted',
      versions: '&id, contentId, deviceName, createdAt, isDeleted'
    });
  }
}
