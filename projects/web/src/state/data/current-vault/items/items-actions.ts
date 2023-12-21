import {createAction} from "@reduxjs/toolkit";
import { ItemContent, ItemEntity } from "./items";
import {EntityUpdate} from "../common/entity";
import {AppThunkDispatch} from "../../../application-state";

export enum ItemsActions {
  CREATE = "items/create",
  UPDATE = "items/update",
  DELETE = "items/delete",
  DELETE_ALL = "items/delete/all"
}

export const _createItemAction = createAction<ItemEntity>(ItemsActions.CREATE);

export function createItem(itemContent: ItemContent) {
  return async (dispatch: AppThunkDispatch) => {
    const id = self.crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // todo: create Localful content & first version

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
  changes: Partial<ItemContent>
}

export const _updateItemAction = createAction<UpdateItemPayload>(ItemsActions.UPDATE);

export function updateItem(id: string, changes: EntityUpdate<ItemEntity>) {
  return (dispatch: AppThunkDispatch) => {
    // todo: create new Localful version, update item in state

    dispatch(_updateItemAction({
      id,
      changes,
    }));
  }
}

export const _deleteItemAction = createAction<string>(ItemsActions.DELETE);

export function deleteItem(id: string) {
  return (dispatch: AppThunkDispatch) => {
    // todo: delete Localful content & versions, delete item in state

    dispatch(_deleteItemAction(id));
  }
}

export const _deleteAllItems = createAction<string>(ItemsActions.DELETE_ALL);
