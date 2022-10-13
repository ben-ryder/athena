import {Draft} from "@reduxjs/toolkit";
import {createTag, deleteTag, updateTag} from "./tags-actions";
import {DocumentState} from "../document-interface";
import A from "automerge";


export function createTagReducer(state: Draft<DocumentState>, action: ReturnType<typeof createTag>) {
  return A.change(state, doc => {
    doc.tags.add(action.payload);
  })
}

export function updateTagReducer(state: Draft<DocumentState>, action: ReturnType<typeof updateTag>) {
  return A.change(state, doc => {
    const tag = doc.tags.byId(action.payload.id);
    for (const key of Object.keys(action.payload.changes)) {
      // @ts-ignore
      tag[key] = action.payload.changes[key];
    }
  })
}

export function deleteTagReducer(state: Draft<DocumentState>, action: ReturnType<typeof deleteTag>) {
  return A.change(state, doc => {
    doc.tags.remove(action.payload);
  })
}
