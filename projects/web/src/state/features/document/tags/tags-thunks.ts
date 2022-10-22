import {v4 as createUUID} from "uuid";

import {AppThunk} from "../../../store";
import {DatabaseTag, TagContent} from "../document-interface";
import {createTagChange, deleteTagChange, updateTagChange} from "./tags-changes";
import {updateDocument} from "../document-reducer";


export function createTag(tagContent: TagContent): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const timestamp = new Date().toISOString();
    const tag = {
      name: tagContent.name,
      textColour: tagContent.textColour,
      backgroundColour: tagContent.backgroundColour,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    const updatedDoc = createTagChange(state.document, tag);
    dispatch(updateDocument(updatedDoc));
  }
}

export function updateTag(tagId: string, changes: Partial<TagContent>): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const timestamp = new Date().toISOString();

    const updatedDoc = updateTagChange(state.document, tagId, {
      ...changes,
      updatedAt: timestamp
    });
    dispatch(updateDocument(updatedDoc));
  }
}

export function deleteTag(tagId: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    const updatedDoc = deleteTagChange(state.document, tagId);
    dispatch(updateDocument(updatedDoc));
  }
}
