import {DatabaseTask, DocumentState} from "../../document-interface";
import A from "automerge";


export function createTaskChange(doc: DocumentState, task: DatabaseTask) {
  return A.change(doc, doc => {
    doc.tasks.add(task);
  })
}

export function updateTaskChange(doc: DocumentState, id: string, changes: Partial<DatabaseTask>) {
  return A.change(doc, doc => {
    const task = doc.tasks.byId(id);
    for (const key of Object.keys(changes)) {
      // @ts-ignore
      task[key] = changes[key];
    }
  })
}

export function deleteTaskChange(doc: DocumentState, id: string) {
  return A.change(doc, doc => {
    doc.tasks.remove(id);
  })
}

export function deleteTaskListTasksChange(doc: DocumentState, taskListId: string) {
  return A.change(doc, doc => {
    const existingTasks = doc.tasks.ids
      .filter(taskId => doc.tasks.byId(taskId).taskListId === taskListId)

    for (const taskId of existingTasks) {
      doc.tasks.remove(taskId);
    }
  })
}
