import { VaultDatabase } from "../../../application-state";
import { lfbApplication } from "../../../../utils/lfb-context";
import {
  ActionResponse, CreateActionResponse,
  existsInTable,
  GenericNotFoundOnDeleteMessage,
  GenericNotFoundOnUpdateMessage
} from "../common/actions";
import { EntityUpdate } from "../common/entity";;
import { ItemContent } from "../items/items";
import { _createItemChange, _deleteItemChange, _updateItemChange } from "./items.changes";

export async function createItem(content: ItemContent): Promise<CreateActionResponse> {
  try {
    const {id, change} = _createItemChange(content)
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

export async function updateItem(doc: VaultDatabase, id: string, update: EntityUpdate<ItemContent>): Promise<ActionResponse> {
  try {
    if (!existsInTable(doc.items, id)) {
      return {success: false, error: {userMessage: GenericNotFoundOnUpdateMessage}}
    }

    await lfbApplication.makeChange(_updateItemChange(id, update));

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

export async function deleteItem(doc: VaultDatabase, id: string): Promise<ActionResponse> {
  if (!existsInTable(doc.items, id)) {
    return {success: false, error: {userMessage: GenericNotFoundOnDeleteMessage}}
  }

  try {
    await lfbApplication.makeChange(_deleteItemChange(id));

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
