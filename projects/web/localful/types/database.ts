import {z} from "zod"
import {IdField, BooleanField, TimestampField} from "./fields";

export const DatabaseFields = z.object({
  name: z.string(),
}).strict()
export type DatabaseFields = z.infer<typeof DatabaseFields>

export const DatabaseEntity = DatabaseFields.extend({
  id: IdField,
  protectedEncryptionKey: z.string(),
  protectedData: z.string().optional(),
  createdAt: TimestampField,
  updatedAt: TimestampField
}).strict()
export type DatabaseEntity = z.infer<typeof DatabaseEntity>

export const LocalDatabaseEntity = DatabaseEntity.extend({
  syncEnabled: BooleanField,
  lastSyncedAt: TimestampField,
}).strict()
export type LocalDatabaseEntity = z.infer<typeof LocalDatabaseEntity>
