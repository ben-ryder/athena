import * as A from "@automerge/automerge";
import { AthenaDatabase } from "../athena-database";

/**
 * The initial change used to create the Automerge document.
 * This is a 'hardcoded' binary change which means that content created on
 * different clients is compatible even if both start locally.
 *
 * It can be created using `npm run initial-change`
 */
export const initialChange = Uint8Array.from([
  133,111,74,131,48,43,160,25,1,162,2,0,16,145,142,19,48,165,39,74,76,144,106,
  226, 32,221,110,155,87,1,1,0,0,0,7,1,20,2,36,21,164,1,52,1,66,26,86,2,112,2,
  0,1,3,0,0,1,6,0,0,1,6,0,0,1,3,0,0,1,127,0,0,1,127,1,2,2,0,1,127,5,2,6,127,5,
  2,9,0,1,127,12,2,13,127,12,2,16,0,1,127,19,2,20,0,1,127,23,104,4,116,97,103,
  115,7,99,111,110,116,101,110,116,8,101,110,116,105,116,105,101,115,3,105,
  100,115,5,110,111,116,101,115,7,99,111,110,116,101,110,116,8,101,110,116,105,
  116,105,101,115,3,105,100,115,5,108,105,115,116,115,8,101,110,116,105,116,
  105,101,115,3,105,100,115,5,116,97,115,107,115,7,99,111,110,116,101,110,116,
  8,101,110,116,105,116,105,101,115,3,105,100,115,5,108,105,115,116,115,8,101,
  110,116,105,116,105,101,115,3,105,100,115,5,112,97,103,101,115,7,99,111,110,
  116,101,110,116,8,101,110,116,105,116,105,101,115,3,105,100,115,8,115,101,
  116,116,105,110,103,115,8,104,111,109,101,112,97,103,101,24,3,0,127,2,3,0,
  127,2,2,0,127,2,3,0,127,2,2,0,127,2,3,0,125,2,0,1,24,0,24,0
]) as A.Change;

export const [initialDocument] = A.applyChanges<AthenaDatabase>(
  A.init<AthenaDatabase>(),
  [initialChange],
);