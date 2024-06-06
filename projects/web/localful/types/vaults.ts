import {z} from "zod"
import {IdField, BooleanField, TimestampField} from "./fields";

export const VaultFields = z.object({
  name: z.string(),
}).strict()
export type VaultFields = z.infer<typeof VaultFields>

export const VaultEntity = VaultFields.extend({
  id: IdField,
  protectedEncryptionKey: z.string(),
  protectedData: z.string().optional(),
  createdAt: TimestampField,
  updatedAt: TimestampField
}).strict()
export type DatabaseEntity = z.infer<typeof VaultEntity>

export const LocalVaultEntity = VaultEntity.extend({
  syncEnabled: BooleanField,
  lastSyncedAt: TimestampField,
}).strict()
export type LocalVaultEntity = z.infer<typeof LocalVaultEntity>
