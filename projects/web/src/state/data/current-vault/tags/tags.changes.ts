import { VaultDatabase } from "../../../application-state";
import { TagContent } from "./tags";
import { EntityUpdate } from "../common/entity";
import { createUUID } from "../common/fields";

export function _createTagChange(content: TagContent) {
  const id = createUUID()
  const timestamp = new Date().toISOString();

  const change = (db: VaultDatabase) => {
    db.tags.ids.push(id);
    db.tags.entities[id] = {
      id,
      name: content.name,
      variant: content.variant,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  return {id, change}
}

export function _updateTagChange(id: string, update: EntityUpdate<TagContent>) {
  return (db: VaultDatabase) => {
    const timestamp = new Date().toISOString();

    if (update.name && db.tags.entities[id].name !== update.name) {
      db.tags.entities[id].name = update.name;
    }
    if (
      update.variant !== undefined
      && db.tags.entities[id].variant !== update.variant
    ) {
      db.tags.entities[id].variant = update.variant;
    }

    db.tags.entities[id].updatedAt = timestamp;
  }
}

export function _deleteTagChange(id: string) {
  return (db: VaultDatabase) => {
    // Delete from tags
    const tagIndex = db.tags.ids.indexOf(id)
    db.tags.ids.splice(tagIndex, 1)
    delete db.tags.entities[id];

    // Remove from all content
    for (const itemId of db.items.ids) {
      const noteTagIndex = db.items.entities[itemId].tags.indexOf(id)
      if (noteTagIndex !== -1) {
        db.items.entities[itemId].tags.splice(noteTagIndex, 1)
      }
    }
    for (const viewId of db.views.ids) {
      const viewTagIndex = db.views.entities[viewId].tags.indexOf(id)
      if (viewTagIndex !== -1) {
        db.views.entities[viewId].tags.splice(viewTagIndex, 1)
      }
    }
  }
}
