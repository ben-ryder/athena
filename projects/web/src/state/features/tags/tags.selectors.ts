import { TagEntity } from "./tags.types";
import { AthenaDatabase } from "../../athena-database";

export function getAllTags(doc: AthenaDatabase): TagEntity[] {
  return doc.tags.content.ids.map(
    (id) => doc.tags.content.entities[id],
  );
}

export function getTag(doc: AthenaDatabase, id: string): TagEntity | undefined {
  return doc.tags.content.entities[id]
}
