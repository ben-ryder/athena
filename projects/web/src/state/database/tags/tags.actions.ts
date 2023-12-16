import { VaultDatabase } from "../database.types";
import { TagContent, TagEntity } from "./tags";
import { lfbApplication } from "../../../utils/lfb-context";
import {
  ActionResponse,
  existsInTable,
  GenericNotFoundOnDeleteMessage,
  GenericNotFoundOnUpdateMessage
} from "../common/actions";
import { EntityUpdate } from "../common/entity";

export async function createTag(tag: TagEntity): Promise<ActionResponse> {
  try {
    await lfbApplication.makeChange((doc: VaultDatabase) => {
      doc.tags.ids.push(tag.id);
      doc.tags.entities[tag.id] = tag;
    });

    return {
      success: true
    }
  }
  catch(e) {
    return {
      success: false,
      error: {
        context: e as Error
      }
    }
  }
}

export async function updateTag(doc: VaultDatabase, id: string, tagUpdate: EntityUpdate<TagContent>): Promise<ActionResponse> {
  try {
    if (!existsInTable(doc.tags, id)) {
      return {success: false, error: {userMessage: GenericNotFoundOnUpdateMessage}}
    }

    const timestamp = new Date().toISOString();

    await lfbApplication.makeChange((doc: VaultDatabase) => {
      // Check old values so we only change what's needed
      // todo: assumption that automerge will register change even if new value is the same?
      // todo: using string values means there will always be a conflict if edited at the same time
      if (tagUpdate.name && doc.tags.entities[id].name !== tagUpdate.name) {
        doc.tags.entities[id].name = tagUpdate.name;
      }
      if (
        tagUpdate.variant !== undefined
        && doc.tags.entities[id].variant !== tagUpdate.variant
      ) {
        doc.tags.entities[id].variant = tagUpdate.variant;
      }

      doc.tags.entities[id].updatedAt = timestamp;
    });

    return {
      success: true
    }
  }
  catch(e) {
    return {
      success: false,
      error: {
        context: e as Error
      }
    }
  }
}

export async function deleteTag(doc: VaultDatabase, id: string): Promise<ActionResponse> {
  if (!existsInTable(doc.tags, id)) {
    return {success: false, error: {userMessage: GenericNotFoundOnDeleteMessage}}
  }

  try {
    await lfbApplication.makeChange((doc: VaultDatabase) => {
      // Delete from tags
      const tagIndex = doc.tags.ids.indexOf(id)
      doc.tags.ids.splice(tagIndex, 1)
      delete doc.tags.entities[id];

      // Remove from all content
      for (const itemId of doc.items.ids) {
        const noteTagIndex = doc.items.entities[itemId].tags.indexOf(id)
        if (noteTagIndex !== -1) {
          doc.items.entities[itemId].tags.splice(noteTagIndex, 1)
        }
      }
      for (const viewId of doc.views.ids) {
        const viewTagIndex = doc.views.entities[viewId].tags.indexOf(id)
        if (viewTagIndex !== -1) {
          doc.views.entities[viewId].tags.splice(viewTagIndex, 1)
        }
      }
    });

    return {
      success: true
    }
  }
  catch (e) {
    return {
      success: false,
      error: {
        context: e as Error
      }
    }
  }
}
