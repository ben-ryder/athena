import * as A from "@automerge/automerge";
import { AthenaDatabase } from "./athena-database";

/**
 * The initial change used to create the Automerge document.
 * This is a 'hardcoded' binary change which means that content created on different clients is compatible even if both start locally.
 */
export const initialChange = Uint8Array.from([
  133, 111, 74, 131, 15, 203, 70, 115, 1, 230, 2, 0, 16, 243, 107, 138, 183,
  204, 215, 78, 174, 145, 27, 164, 7, 52, 81, 19, 116, 1, 1, 0, 0, 0, 7, 1, 24,
  2, 44, 21, 214, 1, 52, 1, 66, 32, 86, 2, 112, 2, 0, 1, 3, 0, 0, 1, 6, 0, 0, 1,
  3, 0, 0, 1, 6, 0, 0, 1, 3, 0, 0, 1, 3, 0, 0, 1, 127, 1, 2, 2, 0, 1, 127, 5, 2,
  6, 127, 5, 2, 9, 0, 1, 127, 12, 2, 13, 0, 1, 127, 16, 2, 17, 127, 16, 2, 20,
  0, 1, 127, 23, 2, 24, 0, 1, 127, 27, 2, 28, 98, 4, 116, 97, 103, 115, 7, 99,
  111, 110, 116, 101, 110, 116, 8, 101, 110, 116, 105, 116, 105, 101, 115, 3,
  105, 100, 115, 5, 110, 111, 116, 101, 115, 7, 99, 111, 110, 116, 101, 110,
  116, 8, 101, 110, 116, 105, 116, 105, 101, 115, 3, 105, 100, 115, 9, 116, 101,
  109, 112, 108, 97, 116, 101, 115, 8, 101, 110, 116, 105, 116, 105, 101, 115,
  3, 105, 100, 115, 5, 116, 97, 115, 107, 115, 7, 99, 111, 110, 116, 101, 110,
  116, 8, 101, 110, 116, 105, 116, 105, 101, 115, 3, 105, 100, 115, 7, 106, 111,
  117, 114, 110, 97, 108, 7, 99, 111, 110, 116, 101, 110, 116, 8, 101, 110, 116,
  105, 116, 105, 101, 115, 3, 105, 100, 115, 9, 116, 101, 109, 112, 108, 97,
  116, 101, 115, 8, 101, 110, 116, 105, 116, 105, 101, 115, 3, 105, 100, 115, 9,
  114, 101, 109, 105, 110, 100, 101, 114, 115, 7, 99, 111, 110, 116, 101, 110,
  116, 8, 101, 110, 116, 105, 116, 105, 101, 115, 3, 105, 100, 115, 5, 118, 105,
  101, 119, 115, 7, 99, 111, 110, 116, 101, 110, 116, 8, 101, 110, 116, 105,
  116, 105, 101, 115, 3, 105, 100, 115, 30, 3, 0, 127, 2, 3, 0, 127, 2, 2, 0,
  127, 2, 3, 0, 127, 2, 3, 0, 127, 2, 2, 0, 127, 2, 3, 0, 127, 2, 3, 0, 127, 2,
  30, 0, 30, 0,
]) as A.Change;

export const [initialDocument] = A.applyChanges<AthenaDatabase>(
  A.init<AthenaDatabase>(),
  [initialChange],
);

/**
 * This is the code used to generate the initial change which setups up an empty document
 * matching the expected database structure for Athena.
 *
 * const doc = A.change(
 * 	A.init(),
 * 	(doc) => {
 * 		doc.tags = {
 * 			content: {entities: {}, ids: []}
 * 		};
 * 		doc.notes = {
 * 			content: {entities: {}, ids: []},
 * 			templates: {entities: {}, ids: []}
 * 		};
 * 		doc.tasks = {
 * 			content: {entities: {}, ids: []}
 * 		};
 * 		doc.journal = {
 * 			content: {entities: {}, ids: []},
 * 			templates: {entities: {}, ids: []}
 * 		};
 * 		doc.reminders = {
 * 			content: {entities: {}, ids: []}
 * 		};
 * 		doc.views = {
 * 			content: {entities: {}, ids: []}
 * 		};
 * 	}
 * );
 *
 * console.log(A.getLastLocalChange(doc).join(","));
 *
 */
