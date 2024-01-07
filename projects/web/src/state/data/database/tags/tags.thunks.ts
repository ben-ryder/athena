import {EntityUpdate} from "../common/entity";
import { store } from "../../../application-state";
import { TagData } from "./tags";
import { _clearTags, _createTag, _deleteTag, _updateTag } from "./tags.state";
import { ActionResult } from "../../../actions";

export async function createTag(data: TagData): Promise<ActionResult<string>> {
  const id = self.crypto.randomUUID();
  const timestamp = new Date().toISOString();

  // todo: add tag to localful storage

  store.dispatch(_createTag({
    id,
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp
  }))

  return {
    success: true,
    data: id
  }
}

export async function updateTag(id: string, changes: EntityUpdate<TagData>): Promise<ActionResult> {
  // todo: update tag in localful storage

  store.dispatch(_updateTag({
    id,
    changes,
  }));

  return {
    success: true,
    data: undefined
  }
}

export async function deleteTag(id: string): Promise<ActionResult> {
  // todo: delete tag in localful storage

  store.dispatch(_deleteTag(id));

  return {
    success: true,
    data: undefined
  }
}

// this is a state only action, so no Localful calls are required here.
export function clearTags() {
  store.dispatch(_clearTags());
}
