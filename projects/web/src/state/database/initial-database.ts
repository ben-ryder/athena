import * as A from "@automerge/automerge";
import { VaultDatabase } from "./database.types";

/**
 * The initial change used to create the Automerge document, generated with
 * `npm run generate-initial-change`
 *
 *
 * This is a 'hardcoded' binary change which means that content created on
 * different clients is compatible even if both start locally.
 *
 * It can be created using `npm run initial-change`
 */
export const initialChange = Uint8Array.from([
  133,111,74,131,110,0,234,55,1,169,1,0,16,158,194,246,110,189,182,71,100,187,27,146,125,107,196,64,144,1,1,0,0,0,7,1,
  16,2,16,21,80,52,1,66,14,86,2,112,2,0,1,2,0,0,1,2,0,0,1,2,0,0,1,127,0,0,1,2,1,0,1,2,4,0,1,2,7,0,1,127,10,117,4,116,97
  ,103,115,8,101,110,116,105,116,105,101,115,3,105,100,115,5,105,116,101,109,115,8,101,110,116,105,116,105,101,115,3,
  105,100,115,5,118,105,101,119,115,8,101,110,116,105,116,105,101,115,3,105,100,115,8,115,101,116,116,105,110,103,115,
  13,116,101,109,112,108,97,116,101,115,86,105,101,119,11,2,0,127,2,2,0,127,2,2,0,125,2,0,1,11,0,11,0
]) as A.Change;

export const [initialDatabase] = A.applyChanges<VaultDatabase>(
  A.init<VaultDatabase>(),
  [initialChange],
);
