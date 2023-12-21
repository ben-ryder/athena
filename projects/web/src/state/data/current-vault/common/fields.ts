import {z} from "zod";
import { v4 } from "uuid";

export const IdField = z.string().uuid()
export type IdField = z.infer<typeof IdField>

export const NameField = z.string()
export type NameField = z.infer<typeof NameField>

export const TagsField = z.array(IdField)
export type TagsField = z.infer<typeof TagsField>

// @todo: remove in favour of just using crypto function.
// Kept for now to get tests working, as jest jdom env seems to choke on esm.
export function createUUID() {
  if (typeof self !== 'undefined') {
    return self.crypto.randomUUID()
  }
  else {
    return v4()
  }
}