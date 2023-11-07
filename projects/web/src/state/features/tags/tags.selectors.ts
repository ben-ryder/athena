import { TagEntity } from "./tags.types.js";
import { AthenaDatabase } from "../../athena-database.js";

export function getAllTags(doc: AthenaDatabase): TagEntity[] {
  return doc.tags.content.ids.map(
    (id) => doc.tags.content.entities[id],
  );
}

export function getTag(doc: AthenaDatabase, id: string): TagEntity | undefined {
  return doc.tags.content.entities[id]
}
