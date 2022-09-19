import {ApplicationState} from "../../../store";
import {getChildFolders} from "./file-system-helpers";
import {FolderTreeItem} from "./folders-selectors";
import {produce} from "immer";

export function flattenFolderTree(folderTreeItem: FolderTreeItem) {
  const folderIds: string[] = [folderTreeItem.details.id];
  for (const folder of folderTreeItem.folders) {
     folderIds.push(...flattenFolderTree(folder));
  }

  return folderIds;
}

export function deleteFoldersReducer(state: ApplicationState, folderId: string) {
  return produce(state, state => {
    const foldersToDelete: string[] = [folderId];
    const childFolders = getChildFolders(state.currentVault.folders, folderId);
    for (const folder of childFolders) {
      foldersToDelete.push(...flattenFolderTree(folder));
    }

    // Delete notes and related tags
    state.currentVault.notesTags.ids = state.currentVault.notesTags.ids.filter(id => {
      const tag = state.currentVault.notesTags.entities[id];
      const entity = state.currentVault.notes.entities[tag.noteId];
      if (typeof entity.folderId === "string" && foldersToDelete.includes(entity.folderId)) {
        delete state.currentVault.notesTags.entities[id];
        return false;
      }
      return true;
    })
    state.currentVault.notes.ids = state.currentVault.notes.ids.filter(id => {
      const entity = state.currentVault.notes.entities[id];
      if (typeof entity.folderId === "string" && foldersToDelete.includes(entity.folderId)) {
        delete state.currentVault.notes.entities[id];
        return false;
      }
      return true;
    })

    // Delete note templates and related tags
    state.currentVault.noteTemplatesTags.ids = state.currentVault.noteTemplatesTags.ids.filter(id => {
      const tag = state.currentVault.noteTemplatesTags.entities[id];
      const entity = state.currentVault.noteTemplates.entities[tag.templateId];
      if (typeof entity.folderId === "string" && foldersToDelete.includes(entity.folderId)) {
        delete state.currentVault.noteTemplatesTags.entities[id];
        return false;
      }
      return true;
    })
    state.currentVault.noteTemplates.ids = state.currentVault.noteTemplates.ids.filter(id => {
      const entity = state.currentVault.noteTemplates.entities[id];
      if (typeof entity.folderId === "string" && foldersToDelete.includes(entity.folderId)) {
        delete state.currentVault.noteTemplates.entities[id];
        return false;
      }
      return true;
    })

    // Delete task list and related tags
    state.currentVault.taskListsTags.ids = state.currentVault.taskListsTags.ids.filter(id => {
      const tag = state.currentVault.taskListsTags.entities[id];
      const entity = state.currentVault.taskLists.entities[tag.taskListId];
      if (typeof entity.folderId === "string" && foldersToDelete.includes(entity.folderId)) {
        delete state.currentVault.taskListsTags.entities[id];
        return false;
      }
      return true;
    })
    state.currentVault.taskLists.ids = state.currentVault.taskLists.ids.filter(id => {
      const entity = state.currentVault.taskLists.entities[id];
      if (typeof entity.folderId === "string" && foldersToDelete.includes(entity.folderId)) {
        delete state.currentVault.taskLists.entities[id];
        return false;
      }
      return true;
    })

    // Delete folders
    state.currentVault.folders.ids = state.currentVault.folders.ids.filter(id => {
      if (foldersToDelete.includes(id)) {
        delete state.currentVault.folders.entities[id];
        return false;
      }
      return true;
    })
  })
}