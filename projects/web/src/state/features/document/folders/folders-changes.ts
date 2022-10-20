import {DatabaseFolder, DatabaseNote, DocumentState} from "../document-interface";
import A from "automerge";
import {getChildFolderIds} from "./file-system-helpers";

export function createFolderChange(doc: DocumentState, folder: DatabaseFolder) {
  return A.change(doc, doc => {
    doc.folders.add(folder);
  })
}

export function updateFolderChange(doc: DocumentState, id: string, changes: Partial<DatabaseFolder>) {
  return A.change(doc, doc => {
    const folder = doc.folders.byId(id);
    for (const key of Object.keys(changes)) {
      // @ts-ignore
      folder[key] = changes[key];
    }
  })
}

// todo: there is repeated logic here to clean up tags
export function deleteFolderChange(doc: DocumentState, folderId: string) {
  return A.change(doc, doc => {
    // First remove the actual folder
    doc.folders.remove(folderId);

    // Find all child folders that now need to be deleted
    const foldersToDelete: string[] = [
      folderId,
      ...getChildFolderIds(doc.folders, folderId)
    ];
    for (const id of foldersToDelete) {
      doc.folders.remove(id);
    }

    // Delete notes and related tags
    const notesToDelete = doc.notes.ids.filter(id => doc.notes.byId(id).folderId === folderId);
    const noteTagsToDelete = doc.notesTags.ids.filter(id => {
      const noteTag = doc.notesTags.byId(id);
      return noteTag.noteId === null || !notesToDelete.includes(noteTag.noteId);
    })
    for (const id of notesToDelete) {
      doc.notes.remove(id);
    }
    for (const id of noteTagsToDelete) {
      doc.notesTags.remove(id);
    }

    // Delete note templates and related tags
    const noteTemplatesToDelete = doc.noteTemplates.ids.filter(id => doc.noteTemplates.byId(id).folderId === folderId);
    const noteTemplateTagsToDelete = doc.noteTemplatesTags.ids.filter(id => {
      const noteTemplateTag = doc.noteTemplatesTags.byId(id);
      return noteTemplateTag.templateId === null || !noteTemplatesToDelete.includes(noteTemplateTag.templateId);
    })
    for (const id of noteTemplatesToDelete) {
      doc.noteTemplates.remove(id);
    }
    for (const id of noteTemplateTagsToDelete) {
      doc.noteTemplatesTags.remove(id);
    }

    // Delete task list and related tags
    const taskListsToDelete = doc.taskLists.ids.filter(id => doc.taskLists.byId(id).folderId === folderId);
    const taskListTagsToDelete = doc.taskListsTags.ids.filter(id => {
      const taskListsTag = doc.taskListsTags.byId(id);
      return taskListsTag.taskListId === null || !taskListsToDelete.includes(taskListsTag.taskListId);
    })
    for (const id of taskListsToDelete) {
      doc.taskLists.remove(id);
    }
    for (const id of taskListTagsToDelete) {
      doc.taskListsTags.remove(id);
    }
  })
}
