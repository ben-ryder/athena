import {z} from "zod"
import {IdField, BooleanField, TimestampField} from "./fields";

export const DatabaseContent = z.object({
  name: z.string(),
}).strict()
export type DatabaseContent = z.infer<typeof DatabaseContent>

export const DatabaseEntity = DatabaseContent.extend({
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
