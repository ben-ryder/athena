import {v4 as createUUID} from "uuid";
import {DocumentState} from "../document-interface";
import A from "automerge";


export function updateNoteTagsChange(doc: DocumentState, noteId: string, tags: string[]) {
  return A.change(doc, doc => {
    const existingTags = doc.notesTags.ids.filter(noteTagId => {
      return doc.notesTags.byId(noteTagId).noteId === noteId
    });

    // Remove existing tags
    for (const noteTagId of existingTags) {
     doc.notesTags.remove(noteTagId);
    }

    // Add new tags
    for (const tagId of tags) {
      const id = createUUID();
      doc.notesTags.add({
        id,
        noteId,
        tagId
      })
    }
  })
}
