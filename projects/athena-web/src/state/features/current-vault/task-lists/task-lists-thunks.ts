import {v4 as createUUID} from "uuid";
import {AppThunkDispatch} from "../../../store";
import {createTaskList, updateTaskList} from "./task-lists-actions";
import {DatabaseTaskList} from "./task-lists-interface";

export function createNewTaskList(name: string) {
  return (dispatch: AppThunkDispatch) => {
    const templateId = createUUID();
    const timestamp = new Date().toISOString();

    const taskList: DatabaseTaskList = {
      id: templateId,
      name: name,
      folderId: null,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    dispatch(createTaskList(taskList));
  }
}

export function renameTaskList(taskListId: string, newName: string) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(updateTaskList({
      id: taskListId,
      changes: {
        name: newName,
        updatedAt: timestamp
      }
    }));
  }
}

export function moveTaskList(taskListId: string, newFolder: string | null) {
  return (dispatch: AppThunkDispatch) => {
    const timestamp = new Date().toISOString();

    dispatch(updateTaskList({
      id: taskListId,
      changes: {
        folderId: newFolder,
        updatedAt: timestamp
      }
    }));
  }
}
