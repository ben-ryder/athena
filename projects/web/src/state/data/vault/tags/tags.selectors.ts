import { TagEntity } from "./tags";
import { VaultDatabase } from "../../../application-state";

export function getAllTags(doc: VaultDatabase): TagEntity[] {
  return doc.tags.ids.map(
    (id) => doc.tags.entities[id],
  );
}

export function getTag(doc: VaultDatabase, id: string): TagEntity | undefined {
  return doc.tags.entities[id]
}
