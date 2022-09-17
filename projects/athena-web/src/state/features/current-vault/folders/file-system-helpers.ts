import {FoldersState} from "./folders-interface";
import {FileSystemFolder, FolderTreeItem} from "./folders-selectors";
import {NotesState} from "../notes/notes-interface";
import {NoteTemplatesState} from "../note-templates/note-templates-interface";
import {TaskListState} from "../task-lists/task-lists-interface";
import {ContentData} from "../../ui/content/content-selctors";
import {ContentType} from "../../ui/content/content-interface";

export function validateFolderMove(foldersState: FoldersState, folderId: string, newParentId: string): boolean {
  return false;
}

export function getChildFolders(foldersState: FoldersState, parentFolderId: string | null) {
  const folders: FolderTreeItem[] = [];

  for (const folderId of foldersState.ids) {
    const folder = foldersState.entities[folderId];

    if (folder.parentId === parentFolderId) {
      const folderItem: FolderTreeItem = {
        details: folder,
        folders: getChildFolders(foldersState, folder.id)
      }

      folders.push(folderItem);
    }
  }

  return folders;
}

export function getFolderFiles(
  folderId: string | null, notesState: NotesState, noteTemplatesState: NoteTemplatesState, taskListsState: TaskListState
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
  folderId: string | null, foldersState: FoldersState, notesState: NotesState, noteTemplatesState: NoteTemplatesState, taskListsState: TaskListState
) {
  const fileSystemFolders: FileSystemFolder[] = [];

  for (const folderId of foldersState.ids) {
    const folder = foldersState.entities[folderId];

    if (folder.parentId === folderId) {
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