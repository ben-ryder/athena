import {Draft} from "@reduxjs/toolkit";

import {createNote, deleteNote, updateNote} from "./notes-actions";
import {DocumentState} from "../document-interface";
import A from "automerge";


export function createNoteReducer(state: Draft<DocumentState>, action: ReturnType<typeof createNote>) {
  return A.change(state, doc => {
    doc.notes.add(action.payload);
  })
}

export function updateNoteReducer(state: Draft<DocumentState>, action: ReturnType<typeof updateNote>) {
  return A.change(state, doc => {
    const note = doc.notes.byId(action.payload.id);
    for (const key of Object.keys(action.payload.changes)) {
      // @ts-ignore
      note[key] = action.payload.changes[key];
    }
  })
}

export function deleteNoteReducer(state: Draft<DocumentState>, action: ReturnType<typeof deleteNote>) {
  return A.change(state, doc => {
    doc.notes.remove(action.payload);
  })
}
