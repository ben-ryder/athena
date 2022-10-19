import {DatabaseTag, DocumentState} from "../document-interface";
import A from "automerge";

export function createTagChange(doc: DocumentState, tag: DatabaseTag) {
  return A.change(doc, doc => {
    doc.tags.add(tag);
  })
}

export function updateTagChange(doc: DocumentState, id: string, changes: Partial<DatabaseTag>) {
  return A.change(doc, doc => {
    const tag = doc.tags.byId(id);
    for (const key of Object.keys(changes)) {
      // @ts-ignore
      tag[key] = changes[key];
    }
  })
}

export function deleteTagChange(doc: DocumentState, id: string) {
  return A.change(doc, doc => {
    doc.tags.remove(id);
  })
}
