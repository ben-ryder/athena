import {DatabaseNoteTemplate, DocumentState, EntityWithoutId} from "../document-interface";
import A from "automerge";

export function createNoteTemplateChange(doc: DocumentState, template: EntityWithoutId<DatabaseNoteTemplate>) {
  return A.change(doc, doc => {
    // @ts-ignore
    doc.noteTemplates.add(template);
  })
}

export function updateNoteTemplateChange(doc: DocumentState, id: string, changes: Partial<DatabaseNoteTemplate>) {
  return A.change(doc, doc => {
    const template = doc.noteTemplates.byId(id);
    for (const key of Object.keys(changes)) {
      // @ts-ignore
      template[key] = changes[key];
    }
  })
}

export function deleteNoteTemplateChange(doc: DocumentState, id: string) {
  return A.change(doc, doc => {
    doc.noteTemplates.remove(id);
  })
}
