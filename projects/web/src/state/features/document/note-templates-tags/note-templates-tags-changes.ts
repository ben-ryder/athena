import {v4 as createUUID} from "uuid";
import {DocumentState} from "../document-interface";
import A from "automerge";


export function updateNoteTemplateTagsChange(doc: DocumentState, templateId: string, tags: string[]) {
  return A.change(doc, doc => {
    const existingTags = doc.noteTemplatesTags.ids.filter(noteTemplateTagId => {
      return doc.noteTemplatesTags.byId(noteTemplateTagId).templateId === templateId
    });

    // Remove existing tags
    for (const noteTemplateTagId of existingTags) {
     doc.noteTemplatesTags.remove(noteTemplateTagId);
    }

    // Add new tags
    for (const tagId of tags) {
      const id = createUUID();
      doc.noteTemplatesTags.add({
        id,
        templateId,
        tagId
      })
    }
  })
}
