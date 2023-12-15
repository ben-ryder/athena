import {z} from "zod";

export const IdField = z.string().uuid()
export type IdField = z.infer<typeof IdField>

export const NameField = z.string()
export type NameField = z.infer<typeof NameField>

export const TagsField = z.array(IdField)
export type TagsField = z.infer<typeof TagsField>
