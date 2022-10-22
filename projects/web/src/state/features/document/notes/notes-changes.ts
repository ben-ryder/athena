import {DatabaseNote, DocumentState, EntityWithoutId} from "../document-interface";
import A from "automerge";

export function createNoteChange(doc: DocumentState, note: EntityWithoutId<DatabaseNote>) {
  return A.change(doc, doc => {
    // @ts-ignore
    doc.notes.add(note);
  })
}

export function updateNoteChange(doc: DocumentState, id: string, changes: Partial<DatabaseNote>) {
  return A.change(doc, doc => {
    const note = doc.notes.byId(id);
    for (const key of Object.keys(changes)) {
      // @ts-ignore
      note[key] = changes[key];
    }
  })
}

export function deleteNoteChange(doc: DocumentState, id: string) {
  return A.change(doc, doc => {
    doc.notes.remove(id);
  })
}
