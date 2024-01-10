import {EntityVersion} from "../common/entity";
import {z} from "zod";

export const AttachmentData = z.object({
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  data: z.string()
}).strict()
export type AttachmentData = z.infer<typeof AttachmentData>

export const AttachmentEntity = EntityVersion
export type AttachmentEntity = z.infer<typeof AttachmentEntity>

export const AttachmentDto = AttachmentEntity.merge(AttachmentData)
export type AttachmentDto = z.infer<typeof AttachmentDto>
