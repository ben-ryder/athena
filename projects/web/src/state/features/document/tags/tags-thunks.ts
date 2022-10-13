import {v4 as createUUID} from "uuid";

import {createTag, updateTag} from "./tags-actions";
import {AppThunkDispatch} from "../../../store";
import {DatabaseTag, TagContent} from "../document-interface";


export function createNewTag(tagContent: TagContent) {
  return (dispatch: AppThunkDispatch) => {
    const tagId = createUUID();
    const timestamp = new Date().toISOString();

    const tag: DatabaseTag = {
      id: tagId,
      name: tagContent.name,
      textColour: tagContent.textColour,
      backgroundColour: tagContent.backgroundColour,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    dispatch(createTag(tag));
  }
}

export function updateExistingTag(tagId: string, changes: Partial<TagContent>) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(updateTag({
      id: tagId,
      changes: {
        ...changes,
        updatedAt: timestamp
      }
    }));
  }
}
