import * as A from "@automerge/automerge"

const doc = A.change(
  A.init(),
  (doc) => {
    // @ts-ignore
    doc.tags = {
      content: {entities: {}, ids: []}
    };
    // @ts-ignore
    doc.notes = {
      content: {entities: {}, ids: []},
      lists: {entities: {}, ids: []}
    };
    // @ts-ignore
    doc.tasks = {
      content: {entities: {}, ids: []},
      lists: {entities: {}, ids: []}
    };
    // @ts-ignore
    doc.pages = {
      content: {entities: {}, ids: []}
    };
    // @ts-ignore
    doc.settings = {
      homepage: null
    };
  }
);

console.log(A.getLastLocalChange(doc)?.join(","));
