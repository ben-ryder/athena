import {FoldersState} from "./folders-interface";
import {FileSystemFolder, FolderTreeItem} from "./folders-selectors";
import {NotesState} from "../notes/notes-interface";
import {NoteTemplatesState} from "../note-templates/note-templates-interface";
import {TaskListsState} from "../task-lists/task-lists-interface";
import {ContentData} from "../../ui/content/content-selctors";
import {ContentType} from "../../ui/content/content-interface";

export enum FolderMoveValidationResult {
  VALID = "VALID",
  ERROR_SELECTED_SELF = "ERROR_SELECTED_SELF",
  ERROR_SAME_PARENT = "ERROR_SAME_PARENT",
  ERROR_CHILD_FOLDER = "ERROR_CHILD_FOLDER",
}
export function validateFolderMove(foldersState: FoldersState, folderId: string, newParentId: string | null): FolderMoveValidationResult {
  const currentFolder = foldersState.entities[folderId];

  if (newParentId === folderId) {
    return FolderMoveValidationResult.ERROR_SELECTED_SELF;
  }
  if (newParentId === currentFolder.parentId) {
    return FolderMoveValidationResult.ERROR_SAME_PARENT
  }

  if (newParentId === null) {
    return FolderMoveValidationResult.VALID;
  }

  const childFolders = getChildFolderIds(foldersState, folderId);
  if (childFolders.includes(newParentId)) {
    return FolderMoveValidationResult.ERROR_CHILD_FOLDER;
  }

  return FolderMoveValidationResult.VALID;
}

export function getChildFolderTrees(foldersState: FoldersState, parentFolderId: string | null) {
  const folders: FolderTreeItem[] = [];

  for (const folderId of foldersState.ids) {
    const folder = foldersState.entities[folderId];

    if (folder.parentId === parentFolderId) {
      const folderItem: FolderTreeItem = {
        details: folder,
        folders: getChildFolderTrees(foldersState, folder.id)
      }

      folders.push(folderItem);
    }
  }

  return folders;
}

export function flattenFolderTree(folderTreeItem: FolderTreeItem) {
  const folderIds: string[] = [folderTreeItem.details.id];
  for (const folder of folderTreeItem.folders) {
    folderIds.push(...flattenFolderTree(folder));
  }

  return folderIds;
}

export function getChildFolderIds(foldersState: FoldersState, parentFolderId: string | null) {
  const childFolderTrees = getChildFolderTrees(foldersState, parentFolderId);
  const folderIds: string[] = [];
  for (const folderTree of childFolderTrees) {
    folderIds.push(...flattenFolderTree(folderTree))
  }

  return folderIds;
}

export function getFolderFiles(
  folderId: string | null, notesState: NotesState, noteTemplatesState: NoteTemplatesState, taskListsState: TaskListsState
) {
  const files: ContentData[] = [];

  for (const noteId of notesState.ids) {
    const note = notesState.entities[noteId];
    if (note.folderId === folderId) {
      files.push({
        type: ContentType.NOTE,
        data: note
      })
    }
  }

  for (const noteTemplateId of noteTemplatesState.ids) {
    const noteTemplate = noteTemplatesState.entities[noteTemplateId];
    if (noteTemplate.folderId === folderId) {
      files.push({
        type: ContentType.NOTE_TEMPLATE,
        data: noteTemplate
      })
    }
  }

  for (const taskListId of taskListsState.ids) {
    const taskList = taskListsState.entities[taskListId];
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
  parentFolderId: string | null, foldersState: FoldersState, notesState: NotesState, noteTemplatesState: NoteTemplatesState, taskListsState: TaskListsState
) {
  const fileSystemFolders: FileSystemFolder[] = [];

  for (const folderId of foldersState.ids) {
    const folder = foldersState.entities[folderId];

    if (folder.parentId === parentFolderId) {
      const fileSystemFolder: FileSystemFolder = {
        details: folder,
        folders: getChildFileSystemFolders(folder.id, foldersState, notesState, noteTemplatesState, taskListsState),
        files: getFolderFiles(folder.id, notesState, noteTemplatesState, taskListsState)
      }

      fileSystemFolders.push(fileSystemFolder);
    }
  }

  return fileSystemFolders;
}
