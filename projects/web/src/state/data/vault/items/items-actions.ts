import {createAction} from "@reduxjs/toolkit";
import { ItemContent, ItemEntity } from "../items/items";
import { AppThunkDispatch } from "../../../redux";

export enum ItemsActions {
  CREATE = "items/create",
  UPDATE = "items/update",
  DELETE = "items/delete"
}

export const _createItemAction = createAction<ItemEntity>(ItemsActions.CREATE);

export function createItem(itemContent: ItemContent) {
  return async (dispatch: AppThunkDispatch) => {
    const id = self.crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // todo: create Localful content

    const item: ItemEntity = {
      id,
      name: itemContent.name,
      body: itemContent.body,
      tags: itemContent.tags,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    dispatch(_createItemAction(item))
  }
}



export interface UpdateItemPayload {
  id: string,
  content: Partial<ItemContent>
}
export const _updateItemAction = createAction<UpdateItemPayload>(ItemsActions.UPDATE);

export function updateItem(id: string, content: ItemContent) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(_updateItemAction({
      id,
      content,
    }));
  }
}

export const _deleteItemAction = createAction<string>(ItemsActions.DELETE);

export function deleteItem(id: string) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(_deleteItemAction({
      id: noteId,
      changes: {
        body: newBody,
        updatedAt: timestamp
      }
    }));
  }
}
