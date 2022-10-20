import {v4 as createUUID} from "uuid";
import {DocumentState} from "../document-interface";
import A from "automerge";


export function updateTaskListTagsChange(doc: DocumentState, taskListId: string, tags: string[]) {
  return A.change(doc, doc => {
    const existingTags = doc.taskListsTags.ids.filter(taskListTagId => {
      return doc.taskListsTags.byId(taskListTagId).taskListId === taskListId
    });

    // Remove existing tags
    for (const taskListId of existingTags) {
     doc.taskListsTags.remove(taskListId);
    }

    // Add new tags
    for (const tagId of tags) {
      const id = createUUID();
      doc.taskListsTags.add({
        id,
        taskListId,
        tagId
      })
    }
  })
}
