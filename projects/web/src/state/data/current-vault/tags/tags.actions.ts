import { VaultDatabase } from "../../../application-state";
import { TagContent } from "./tags";
import { lfbApplication } from "../../../../utils/lfb-context";
import {
  ActionResponse, CreateActionResponse,
  existsInTable,
  GenericNotFoundOnDeleteMessage,
  GenericNotFoundOnUpdateMessage
} from "../common/actions";
import { EntityUpdate } from "../common/entity";
import { _createTagChange, _deleteTagChange, _updateTagChange } from "./tags.changes";

export async function createTag(content: TagContent): Promise<CreateActionResponse> {
  try {
    const {id, change} = _createTagChange(content)
    await lfbApplication.makeChange(change);

    return {
      success: true,
      id,
    }
  } catch (e) {
    return {
      success: false,
      error: {
        context: e as Error
      }
    }
  }
}

export async function updateTag(doc: VaultDatabase, id: string, update: EntityUpdate<TagContent>): Promise<ActionResponse> {
  try {
    if (!existsInTable(doc.tags, id)) {
      return {success: false, error: {userMessage: GenericNotFoundOnUpdateMessage}}
    }

    await lfbApplication.makeChange(_updateTagChange(id, update));

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
    await lfbApplication.makeChange(_deleteTagChange(id));

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
