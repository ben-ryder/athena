import {FoldersTable, NotesTable, NoteTemplatesTable, TaskListsTable} from "../document-interface";
import {ContentData} from "../../ui/content/content-selctors";
import {ContentType} from "../../ui/content/content-interface";
import {FileSystemFolder, FolderTreeItem} from "./folders-selectors";

export enum FolderMoveValidationResult {
  VALID = "VALID",
  ERROR_SELECTED_SELF = "ERROR_SELECTED_SELF",
  ERROR_SAME_PARENT = "ERROR_SAME_PARENT",
  ERROR_CHILD_FOLDER = "ERROR_CHILD_FOLDER",
}
export function validateFolderMove(folders: FoldersTable, folderId: string, newParentId: string | null): FolderMoveValidationResult {
  const currentFolder = folders.byId(folderId);

  if (newParentId === folderId) {
    return FolderMoveValidationResult.ERROR_SELECTED_SELF;
  }
  if (newParentId === currentFolder.parentId) {
    return FolderMoveValidationResult.ERROR_SAME_PARENT
  }

  if (newParentId === null) {
    return FolderMoveValidationResult.VALID;
  }

  const childFolders = getChildFolderIds(folders, folderId);
  if (childFolders.includes(newParentId)) {
    return FolderMoveValidationResult.ERROR_CHILD_FOLDER;
  }

  return FolderMoveValidationResult.VALID;
}

export function getChildFolderTrees(folders: FoldersTable, parentFolderId: string | null) {
  const folderTree: FolderTreeItem[] = [];

  for (const folderId of folders.ids) {
    const folder = folders.byId(folderId);

    if (folder.parentId === parentFolderId) {
      const folderItem: FolderTreeItem = {
        details: folder,
        folders: getChildFolderTrees(folders, folder.id)
      }

      folderTree.push(folderItem);
    }
  }

  return folderTree;
}

export function flattenFolderTree(folderTreeItem: FolderTreeItem) {
  const folderIds: string[] = [folderTreeItem.details.id];
  for (const folder of folderTreeItem.folders) {
    folderIds.push(...flattenFolderTree(folder));
  }

  return folderIds;
}

export function getChildFolderIds(folders: FoldersTable, parentFolderId: string | null) {
  const childFolderTrees = getChildFolderTrees(folders, parentFolderId);
  const folderIds: string[] = [];
  for (const folderTree of childFolderTrees) {
    folderIds.push(...flattenFolderTree(folderTree))
  }

  return folderIds;
}

export function getFolderFiles(
  folderId: string | null, notes: NotesTable, noteTemplates: NoteTemplatesTable, taskLists: TaskListsTable
) {
  const files: ContentData[] = [];

  for (const noteId of notes.ids) {
    const note = notes.byId(noteId);
    if (note.folderId === folderId) {
      files.push({
        type: ContentType.NOTE,
        data: note
      })
    }
  }

  for (const noteTemplateId of noteTemplates.ids) {
    const noteTemplate = noteTemplates.byId(noteTemplateId);
    if (noteTemplate.folderId === folderId) {
      files.push({
        type: ContentType.NOTE_TEMPLATE,
        data: noteTemplate
      })
    }
  }

  for (const taskListId of taskLists.ids) {
    const taskList = taskLists.byId(taskListId);
    if (taskList.folderId === folderId) {
      files.push({
        type: ContentType.TASK_LIST,
        data: taskList
      })
    }
  }

  return files;
}

export function getChildFileSystemFolders(
  parentFolderId: string | null, folders: FoldersTable, notes: NotesTable, noteTemplates: NoteTemplatesTable, taskLists: TaskListsTable
) {
  const fileSystemFolders: FileSystemFolder[] = [];

  for (const folderId of folders.ids) {
    const folder = folders.byId(folderId);

    if (folder.parentId === parentFolderId) {
      const fileSystemFolder: FileSystemFolder = {
        details: folder,
        folders: getChildFileSystemFolders(folder.id, folders, notes, noteTemplates, taskLists),
        files: getFolderFiles(folder.id, notes, noteTemplates, taskLists)
      }

      fileSystemFolders.push(fileSystemFolder);
    }
  }

  return fileSystemFolders;
}
