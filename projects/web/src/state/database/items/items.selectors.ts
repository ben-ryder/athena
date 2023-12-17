import { VaultDatabase } from "../database.types";
import { ItemDto } from "./items";

export function getAllItems(db: VaultDatabase): ItemDto[] {
  // todo: handle case where id may exist in .ids but not .entities?
  // @ts-ignore
  return db.items.ids.map((itemId) => {return getItem(db, itemId)})
}

export function getItem(db: VaultDatabase, id: string): ItemDto | undefined {
  const item = db.items.entities[id];
  if (!item) {
    return
  }

  const tags = item.tags.map(tagId => db.tags.entities[tagId]);

  return {
    ...item,
    tagEntities: tags
  };
}
