import {EntityUpdate} from "../common/entity";
import {AppThunkDispatch} from "../../../application-state";
import {
  _createContentItem,
  _updateContentItem,
  _deleteContentItem,
  _clearContentItems
} from "./content-items.state";
import { ContentItemData } from "./content-items";

export function createContentItem(data: ContentItemData) {
  return async (dispatch: AppThunkDispatch) => {
    const id = self.crypto.randomUUID();
    const timestamp = new Date().toISOString();

    dispatch(_createContentItem({
      id,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    }))
  }
}

export function updateContentItem(id: string, changes: EntityUpdate<ContentItemData>) {
  return async (dispatch: AppThunkDispatch) => {
    dispatch(_updateContentItem({
      id,
      changes,
    }));
  }
}

export function deleteContentItem(id: string) {
  return async (dispatch: AppThunkDispatch) => {
    dispatch(_deleteContentItem(id));
  }
}

export function clearContentItems(id: string) {
  return async (dispatch: AppThunkDispatch) => {
    dispatch(_clearContentItems(id));
  }
}
