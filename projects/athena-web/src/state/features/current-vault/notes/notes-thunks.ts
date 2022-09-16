import {v4 as createUUID} from "uuid";

import {createNote, updateNote, updateNoteTags} from "./notes-actions";
import {openRenameContentModal} from "../../ui/modals/modals-actions";
import {ContentType} from "../../ui/content/content-interface";
import {AppThunk, ApplicationState, AppThunkDispatch} from "../../../store";


export function createNewNote(name: string) {
  return (dispatch: AppThunkDispatch) => {
    const noteId = createUUID();
    const timestamp = new Date().toISOString();

    const note = {
      id: noteId,
      name: name,
      body: "",
      folderId: null,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    dispatch(createNote(note))
  }
}

export function renameNote(noteId: string, newName: string) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(updateNote({
      id: noteId,
      changes: {
        name: newName,
        updatedAt: timestamp
      }
    }));
  }
}

export function moveNote(noteId: string, newFolder: string | null) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(updateNote({
      id: noteId,
      changes: {
        folderId: newFolder,
        updatedAt: timestamp
      }
    }));
  }
}

export function updateNoteBody(noteId: string, newBody: string) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(updateNote({
      id: noteId,
      changes: {
        body: newBody,
        updatedAt: timestamp
      }
    }));
  }
}

export function createNoteFromTemplate(templateId: string): AppThunk {
  return function createNoteUsingTemplate(dispatch: AppThunkDispatch, getState: () => ApplicationState) {
    const state = getState();
    const template = state.currentVault.templates.entities[templateId];
    let tagsToAdd: string[] = [];

    // todo: repeated logic in selectors, refactor to reduce repeated code
    for (const templateTagId of state.currentVault.templatesTags.ids) {
      const templateTag = state.currentVault.templatesTags.entities[templateTagId];
      if (templateTag.templateId === templateId) {
        tagsToAdd.push(templateTag.tagId);
      }
    }

    const noteId = createUUID();
    const timestamp = new Date().toISOString();
    const note = {
      id: noteId,
      name: template.name,
      body: template.body,
      folderId: template.targetFolderId,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    // Dispatch the actions to create the new note
    dispatch(createNote(note))
    dispatch(updateNoteTags({
      id: noteId,
      tags: tagsToAdd
    }))

    // Immediately open the content rename modal so users can edit the template name to suite the note
    dispatch(openRenameContentModal({
      type: ContentType.NOTE,
      data: note
    }))
  }
}