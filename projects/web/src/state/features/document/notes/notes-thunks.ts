import {v4 as createUUID} from "uuid";

import {openRenameContentModal} from "../../ui/modals/modals-actions";
import {ContentType} from "../../ui/content/content-interface";
import {AppThunk} from "../../../store";
import {updateDocument} from "../document-reducer";
import {createNoteChange, updateNoteChange} from "./notes-changes";
import {updateNoteTagsChange} from "../notes-tags/notes-tags-changes";


export function createNewNote(name: string, folderId: string | null): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const noteId = createUUID();
    const timestamp = new Date().toISOString();
    const note = {
      id: noteId,
      name: name,
      body: "",
      folderId: folderId,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    const updatedDoc = createNoteChange(state.document, note);
    dispatch(updateDocument(updatedDoc));
  }
}

export function renameNote(noteId: string, newName: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const timestamp = new Date().toISOString();
    const changes = {
      updatedAt: timestamp,
      name: newName
    }

    const updatedDoc = updateNoteChange(state.document, noteId, changes);
    dispatch(updateDocument(updatedDoc));
  }
}

export function moveNote(noteId: string, newFolder: string | null): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const timestamp = new Date().toISOString();
    const changes = {
      updatedAt: timestamp,
      folderId: newFolder
    }

    const updatedDoc = updateNoteChange(state.document, noteId, changes);
    dispatch(updateDocument(updatedDoc));
  }
}

export function updateNoteBody(noteId: string, newBody: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const timestamp = new Date().toISOString();
    const changes = {
      updatedAt: timestamp,
      body: newBody
    }

    const updatedDoc = updateNoteChange(state.document, noteId, changes);
    dispatch(updateDocument(updatedDoc));
  }
}

export function createNoteFromTemplate(templateId: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const template = state.document.noteTemplates.byId(templateId);
    let tagsToAdd: string[] = [];

    // todo: repeated logic in selectors, refactor to reduce repeated code
    for (const templateTagId of state.document.noteTemplatesTags.ids) {
      const templateTag = state.document.noteTemplatesTags.byId(templateTagId);
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
    };

    let updatedDoc = createNoteChange(state.document, note);
    updatedDoc = updateNoteTagsChange(state.document, noteId, tagsToAdd);
    dispatch(updateDocument(updatedDoc));

    // Immediately open the content rename modal so users can edit the template name to suite the note
    dispatch(openRenameContentModal({
      type: ContentType.NOTE,
      data: note
    }))
  }
}
