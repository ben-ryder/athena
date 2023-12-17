import { VaultDatabase } from "../database.types";
import { EntityUpdate } from "../common/entity";
import { ItemContent } from "./items";
import { listRequiresUpdate } from "../common/actions";
import { createUUID } from "../common/fields";

export function _createItemChange(content: ItemContent) {
  const id = createUUID()
  const timestamp = new Date().toISOString();

  const change = (db: VaultDatabase) => {
    db.items.ids.push(id);
    db.items.entities[id] = {
      id,
      name: content.name,
      body: content.body,
      tags: content.tags,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  return { id, change }
}

export function _updateItemChange(id: string, update: EntityUpdate<ItemContent>) {
  return (db: VaultDatabase) => {
    const timestamp = new Date().toISOString();

    if (update.name && db.items.entities[id].name !== update.name) {
      db.items.entities[id].name = update.name;
    }

    // todo: this should apply changes, not reassign string
    if (update.body && db.items.entities[id].body !== update.body) {
      db.items.entities[id].body = update.body;
    }

    // Tags are overwritten as it's a better user experience for a single edit
    // to "win", rather than attempting to combining different edits which may
    // lead to duplicate tags and other unpredictable results for the user.
    if (update.tags && listRequiresUpdate(db.items.entities[id].tags, update.tags)) {
      db.items.entities[id].tags = update.tags;
    }

    db.items.entities[id].updatedAt = timestamp;
  }
}

export function _deleteItemChange(id: string) {
  return (db: VaultDatabase) => {
    const itemIndex = db.items.ids.indexOf(id)
    db.items.ids.splice(itemIndex, 1)
    delete db.items.entities[id];
  }
}
