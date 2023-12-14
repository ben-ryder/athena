import { VaultDatabase } from "../database.types";
import { TagContent, TagEntity } from "./tags.types";
import { lfbApplication } from "../../../utils/lfb-context";
import {
  ActionResponse,
  existsInTable,
  GenericErrorMessage, GenericNotFoundOnDeleteMessage,
  GenericNotFoundOnUpdateMessage
} from "../common/actions";
import { EntityUpdate } from "../common/entity.types";

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
      errorMessage: GenericErrorMessage,
      context: e
    }
  }
}

export async function updateTag(id: string, tagUpdate: EntityUpdate<TagContent>): Promise<ActionResponse> {
  try {
    const timestamp = new Date().toISOString();

    await lfbApplication.makeChange((doc: VaultDatabase) => {
      if (!existsInTable(doc.tags, id)) {
        return {success: false, errorMessage: GenericNotFoundOnUpdateMessage}
      }

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
      errorMessage: GenericErrorMessage,
      context: e
    }
  }
}

export async function deleteTag(id: string): Promise<ActionResponse> {
  // todo: I should use deleteAt instead here when removing tags from content. See https://automerge.org/docs/documents/lists/.
  try {
    await lfbApplication.makeChange((doc: VaultDatabase) => {
      if (!existsInTable(doc.tags, id)) {
        return {success: false, errorMessage: GenericNotFoundOnDeleteMessage}
      }

      // Delete from tags
      doc.tags.ids = doc.tags.ids.filter((tagId) => tagId !== id);
      delete doc.tags.entities[id];

      // Remove from all content
      for (const noteId of doc.items.ids) {
        if (doc.items.entities[noteId].tags.includes(id)) {
          doc.items.entities[noteId].tags = doc.items.entities[noteId].tags.filter((tagId) => tagId !== id)
        }
      }
      for (const viewId of doc.views.ids) {
        if (doc.views.entities[viewId].tags.includes(id)) {
          doc.views.entities[viewId].tags = doc.views.entities[viewId].tags.filter((tagId) => tagId !== id)
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
      errorMessage: GenericErrorMessage,
      context: e
    }
  }
}
