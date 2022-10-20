import {DatabaseTaskList, DocumentState} from "../document-interface";
import A from "automerge";

export function createTaskListChange(doc: DocumentState, taskList: DatabaseTaskList) {
  return A.change(doc, doc => {
    doc.taskLists.add(taskList);
  })
}

export function updateTaskListChange(doc: DocumentState, id: string, changes: Partial<DatabaseTaskList>) {
  return A.change(doc, doc => {
    const taskList = doc.taskLists.byId(id);
    for (const key of Object.keys(changes)) {
      // @ts-ignore
      taskList[key] = changes[key];
    }
  })
}

export function deleteTaskListChange(doc: DocumentState, id: string) {
  return A.change(doc, doc => {
    doc.taskLists.remove(id);
  })
}
