/**
 * This file generates the initial change used to initialize the CRDT database.
 * This change is then hardcoded into src/state/database/initial-database.ts
 */

import * as A from "@automerge/automerge"

const doc = A.change(
  A.init(),
  (doc) => {
    // @ts-ignore
    doc.tags = {
      entities: {},
      ids: []
    };
    // @ts-ignore
    doc.items = {
      entities: {},
      ids: []
    };
    // @ts-ignore
    doc.views = {
      entities: {},
      ids: []
    };
    // @ts-ignore
    doc.settings = {
      templateViews: []
    };
  }
);

console.log(A.getLastLocalChange(doc)?.join(","));
