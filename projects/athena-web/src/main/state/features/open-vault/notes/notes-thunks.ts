import {v4 as createUUID} from "uuid";

import {createNote, updateNoteTags} from "./notes-actions";
import {ApplicationState} from "../../../state-interface";
import {AnyAction, ThunkAction, ThunkDispatch} from "@reduxjs/toolkit";
import {openRenameContentModal} from "../../ui/modals/modals-actions";
import {ContentType} from "../../ui/content/content-interface";

export function createNoteFromTemplate(templateId: string): ThunkAction<void, ApplicationState, unknown, AnyAction> {
  return function createNoteUsingTemplate(dispatch: ThunkDispatch<ApplicationState, unknown, AnyAction>, getState: () => ApplicationState) {
    const state = getState();
    const template = state.openVault.templates.entities[templateId];
    let tagsToAdd: string[] = [];

    // todo: repeated logic in selectors, refactor to reduce repeated code
    for (const templateTagId of state.openVault.templatesTags.ids) {
      const templateTag = state.openVault.templatesTags.entities[templateTagId];
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