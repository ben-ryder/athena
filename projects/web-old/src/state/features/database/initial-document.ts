import * as A from "@automerge/automerge";
import {AthenaDatabase} from "./athena-database";

/**
 * The initial change used to create the Automerge database.
 * This is a 'hardcoded' binary change which means that documents created on different clients are compatible.
 *
 * The change below is the output of the following change:
 * - A.change(A.init(), (doc) => {doc.tags = {entities: {}, ids: []};doc.notes = {entities: {}, ids: []};doc.noteTemplates = {entities: {}, ids: []};doc.tasks = {entities: {}, ids: []};doc.taskLists = {entities: {}, ids: []}});
 */
export const initialChange = Uint8Array.from(
  [133,111,74,131,7,30,148,172,1,210,1,0,16,5,3,238,173,209,135,69,159,152,215,138,119,37,43,7,244,1,1,0,0,0,7,1,20,2,20,21,107,52,1,66,20,86,2,112,2,0,1,2,0,0,1,2,0,0,1,2,0,0,1,2,0,0,1,2,0,0,1,2,1,0,1,2,4,0,1,2,7,0,1,2,10,0,1,2,13,113,4,116,97,103,115,8,101,110,116,105,116,105,101,115,3,105,100,115,5,110,111,116,101,115,8,101,110,116,105,116,105,101,115,3,105,100,115,13,110,111,116,101,84,101,109,112,108,97,116,101,115,8,101,110,116,105,116,105,101,115,3,105,100,115,5,116,97,115,107,115,8,101,110,116,105,116,105,101,115,3,105,100,115,9,116,97,115,107,76,105,115,116,115,8,101,110,116,105,116,105,101,115,3,105,100,115,15,2,0,127,2,2,0,127,2,2,0,127,2,2,0,127,2,2,0,127,2,15,0,15,0]
) as A.Change;


/**
 * Return an Automerge database containing the initial setup change.
 */
export const [initialDocument] = A.applyChanges<AthenaDatabase>(A.init<AthenaDatabase>(), [initialChange]);


