import { Dexie, Table } from 'dexie';
import {ContentEntity, VaultEntity, VersionEntity} from "@localful/common";
import { z } from "zod";

export const VaultStatusDto = z.object({
  id: VaultEntity.shape.id,
  location: z.enum(['local', 'server', 'both']),
  unlock: z.enum(['locked', 'unlocked'])
})
export type VaultStatusDto = z.infer<typeof VaultStatusDto>

export class ApplicationDatabase extends Dexie {
  vaults!: Table<VaultEntity>;
  vaultsStatus!: Table<VaultStatusDto>;

  content!: Table<ContentEntity>;
  versions!: Table<VersionEntity>;

  constructor() {
    super('localful');
    this.version(1).stores({
      vaults: '&id',
      vaultsStatus: '&id',
      content: '&id, vaultId, type, createdAt, isDeleted',
      versions: '&id, contentId, deviceName, createdAt, isDeleted'
    });
  }
}
