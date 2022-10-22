import {v4 as createUUID} from "uuid";
import {AppThunk} from "../../../store";
import {updateDocument} from "../document-reducer";
import {createNoteTemplateChange, deleteNoteTemplateChange, updateNoteTemplateChange} from "./note-templates-changes";
import {updateNoteTemplateTagsChange} from "../note-templates-tags/note-templates-tags-changes";


export function createNoteTemplate(name: string, folderId: string | null): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    const timestamp = new Date().toISOString();

    const template = {
      name: name,
      body: "",
      folderId: folderId,
      targetFolderId: null,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    let updatedDoc = createNoteTemplateChange(state.document, template);
    dispatch(updateDocument(updatedDoc));
  }
}

export function renameNoteTemplate(templateId: string, newName: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    const timestamp = new Date().toISOString();

    let updatedDoc = updateNoteTemplateChange(state.document, templateId, {name: newName, updatedAt: timestamp});
    dispatch(updateDocument(updatedDoc));
  }
}

export function moveNoteTemplate(templateId: string, newFolder: string | null): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    const timestamp = new Date().toISOString();

    let updatedDoc = updateNoteTemplateChange(state.document, templateId, {folderId: newFolder, updatedAt: timestamp});
    dispatch(updateDocument(updatedDoc));
  }
}

export function updateNoteTemplateBody(templateId: string, newBody: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    const timestamp = new Date().toISOString();

    let updatedDoc = updateNoteTemplateChange(state.document, templateId, {body: newBody, updatedAt: timestamp});
    dispatch(updateDocument(updatedDoc));
  }
}

export function updateNoteTemplateTargetFolder(templateId: string, targetFolderId: string | null): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    const timestamp = new Date().toISOString();

    let updatedDoc = updateNoteTemplateChange(state.document, templateId, {targetFolderId: targetFolderId, updatedAt: timestamp});
    dispatch(updateDocument(updatedDoc));
  }
}

export function updateNoteTemplateTags(templateId: string, tags: string[]): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    const timestamp = new Date().toISOString();

    let updatedDoc = updateNoteTemplateTagsChange(state.document, templateId, tags);
    dispatch(updateDocument(updatedDoc));
  }
}

export function deleteNoteTemplate(templateId: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    let updatedDoc = deleteNoteTemplateChange(state.document, templateId);
    updatedDoc = updateNoteTemplateTagsChange(updatedDoc, templateId, []);
    dispatch(updateDocument(updatedDoc));
  }
}
