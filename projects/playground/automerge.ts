import * as AutoMerge from "automerge";

import {Folder, Note, Query, Tag, Task, TaskList, Template, VaultState} from "./app-state";

// export function setupVault(): AutoMerge.FreezeObject<VaultState> {
//   return AutoMerge.change(AutoMerge.init(), (doc: VaultState) => {
//     doc.notes = new AutoMerge.Table<Note>();
//     doc.tags = new AutoMerge.Table<Tag>();
//     doc.templates = new AutoMerge.Table<Template>();
//     doc.folders = new AutoMerge.Table<Folder>();
//     doc.queries = new AutoMerge.Table<Query>();
//     doc.taskLists = new AutoMerge.Table<TaskList>();
//     doc.tasks = new AutoMerge.Table<Task>();
//   })
// }
//
// const initVault = setupVault();
// const initialStartState = AutoMerge.getLastLocalChange(initVault);
// console.log(initialStartState);

const InitialVaultSetup = new Uint8Array([133,111,74,131,152,118,138,241,1,99,0,16,142,55,199,86,197,242,67,86,146,83,246,36,11,223,115,223,1,1,249,197,159,152,6,0,0,5,21,54,52,1,66,2,86,2,112,2,121,5,110,111,116,101,115,4,116,97,103,115,9,116,101,109,112,108,97,116,101,115,7,102,111,108,100,101,114,115,7,113,117,101,114,105,101,115,9,116,97,115,107,76,105,115,116,115,5,116,97,115,107,115,7,7,6,7,0,7,0]) as AutoMerge.BinaryChange;
export function getNewVault(): AutoMerge.FreezeObject<VaultState> {
  const [doc] =  AutoMerge.applyChanges<AutoMerge.FreezeObject<VaultState>>(AutoMerge.init(), [InitialVaultSetup]);
  return doc;
}

let vault1 = getNewVault();
vault1 = AutoMerge.change(vault1, (doc: VaultState) => {
  // @ts-ignore
  doc.notes.add({
    name: "note 1",
    body: "",
    tags: [],
    createdAt: "",
    updatedAt: "",
    folderId: null
  })
})

let vault2 = getNewVault();
vault2 = AutoMerge.change(vault2, (doc: VaultState) => {
  // @ts-ignore
  doc.notes.add({
    name: "note 2",
    body: "",
    tags: [],
    createdAt: "",
    updatedAt: "",
    folderId: null
  })
})

const vault3 = AutoMerge.merge<VaultState>(vault1, vault2);

console.log(vault3.notes);