import { AthenaDatabase } from "../../athena-database";
import { TagContent, TagEntity } from "./tags.types";
import { lfbApplication } from "../../../utils/lfb-context";
import {
  ActionResponse,
  existsInTable,
  GenericErrorMessage, GenericNotFoundOnDeleteMessage,
  GenericNotFoundOnUpdateMessage
} from "../../common/actions";
import { EntityUpdate } from "../../common/entity.types";

export async function createTag(tag: TagEntity): Promise<ActionResponse> {
  try {
    await lfbApplication.makeChange((doc: AthenaDatabase) => {
      doc.tags.content.ids.push(tag.id);
      doc.tags.content.entities[tag.id] = tag;
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

    await lfbApplication.makeChange((doc: AthenaDatabase) => {
      if (!existsInTable(doc.tags.content, id)) {
        return {success: false, errorMessage: GenericNotFoundOnUpdateMessage}
      }

      // Check old values so we only change what's needed
      // todo: assumption that automerge will register change even if new value is the same?
      // todo: using string values means there will always be a conflict if edited at the same time
      if (tagUpdate.name && doc.tags.content.entities[id].name !== tagUpdate.name) {
        doc.tags.content.entities[id].name = tagUpdate.name;
      }
      if (
        tagUpdate.variant !== undefined
        && doc.tags.content.entities[id].variant !== tagUpdate.variant
      ) {
        doc.tags.content.entities[id].variant = tagUpdate.variant;
      }

      doc.tags.content.entities[id].updatedAt = timestamp;
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
    await lfbApplication.makeChange((doc: AthenaDatabase) => {
      if (!existsInTable(doc.tags.content, id)) {
        return {success: false, errorMessage: GenericNotFoundOnDeleteMessage}
      }

      // Delete from tags
      doc.tags.content.ids = doc.tags.content.ids.filter((tagId) => tagId !== id);
      delete doc.tags.content.entities[id];

      // Remove from all content
      for (const noteId of doc.notes.content.ids) {
        if (doc.notes.content.entities[noteId].tags.includes(id)) {
          doc.notes.content.entities[noteId].tags = doc.notes.content.entities[noteId].tags.filter((tagId) => tagId !== id)
        }
      }
      for (const noteListId of doc.notes.views.ids) {
        if (doc.notes.views.entities[noteListId].tags.includes(id)) {
          doc.notes.views.entities[noteListId].tags = doc.notes.views.entities[noteListId].tags.filter((tagId) => tagId !== id)
        }
      }
      for (const taskId of doc.tasks.content.ids) {
        if (doc.tasks.content.entities[taskId].tags.includes(id)) {
          doc.tasks.content.entities[taskId].tags = doc.tasks.content.entities[taskId].tags.filter((tagId) => tagId !== id)
        }
      }
      for (const taskListId of doc.tasks.views.ids) {
        if (doc.tasks.views.entities[taskListId].tags.includes(id)) {
          doc.tasks.views.entities[taskListId].tags = doc.tasks.views.entities[taskListId].tags.filter((tagId) => tagId !== id)
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
