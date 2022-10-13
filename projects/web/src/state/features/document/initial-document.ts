import {BinaryChange, applyChanges, init} from "automerge";
import {Document} from "./document-interface";

/**
 * The initial change used to create the Automerge document.
 * This is a 'hardcoded' binary change which means that documents created on different clients are compatible.
 *
 * The change below is the output of the following change:
 * - A.change(A.init(), (doc) => {doc.folders = new A.Table();doc.noteTemplates = new A.Table();doc.noteTemplatesTags = new A.Table();doc.notes = new A.Table();doc.notesTags = new A.Table();doc.tags = new A.Table();doc.taskLists = new A.Table();doc.tasks = new A.Table();doc.taskListsTags = new A.Table();});
 */
export const initialChange = Uint8Array.from(
  [133,111,74,131,39,146,250,49,1,137,1,0,16,58,207,78,190,147,118,79,161,152,1,162,233,7,209,15,196,1,1,195,136,159,154,6,0,0,5,21,92,52,1,66,2,86,2,112,2,119,7,102,111,108,100,101,114,115,13,110,111,116,101,84,101,109,112,108,97,116,101,115,17,110,111,116,101,84,101,109,112,108,97,116,101,115,84,97,103,115,5,110,111,116,101,115,9,110,111,116,101,115,84,97,103,115,4,116,97,103,115,9,116,97,115,107,76,105,115,116,115,5,116,97,115,107,115,13,116,97,115,107,76,105,115,116,115,84,97,103,115,9,9,6,9,0,9,0]
) as BinaryChange;


/**
 * Return an Automerge document containing the initial setup change.
 */
export function createInitialDocument() {
  const [initialDoc] = applyChanges<Document>(init(), [initialChange]);
  return initialDoc;
}
