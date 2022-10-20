import {v4 as createUUID} from "uuid";
import {DatabaseTask, TaskStatus} from "../../document-interface";
import {updateDocument} from "../../document-reducer";
import {AppThunk} from "../../../../store";
import {createTaskChange, deleteTaskChange, updateTaskChange} from "./task-changes";
import {updateTaskListChange} from "../task-list-changes";


export function createNewTask(taskListId: string, name: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const taskId = createUUID();
    const timestamp = new Date().toISOString();

    const task: DatabaseTask = {
      id: taskId,
      name: name,
      status: TaskStatus.OPEN,
      taskListId: taskListId,
      createdAt: timestamp,
      updatedAt: timestamp
    }

    let updatedDoc = createTaskChange(state.document, task);
    updatedDoc = updateTaskListChange(state.document, taskId, {updatedAt: timestamp});
    dispatch(updateDocument(updatedDoc));
  }
}

export function renameTask(taskId: string, newName: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const task = state.document.tasks.byId(taskId);
    const timestamp = new Date().toISOString();

    let updatedDoc = updateTaskChange(state.document, taskId, {updatedAt: timestamp, name: newName});
    updatedDoc = updateTaskListChange(state.document, task.taskListId, {updatedAt: timestamp});
    dispatch(updateDocument(updatedDoc));
  }
}

export function completeTask(taskId: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const task = state.document.tasks.byId(taskId);
    const timestamp = new Date().toISOString();

    let updatedDoc = updateTaskChange(state.document, taskId, {updatedAt: timestamp, status: TaskStatus.COMPLETED});
    updatedDoc = updateTaskListChange(state.document, task.taskListId, {updatedAt: timestamp});
    dispatch(updateDocument(updatedDoc));
  }
}

export function reopenTask(taskId: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const task = state.document.tasks.byId(taskId);
    const timestamp = new Date().toISOString();

    let updatedDoc = updateTaskChange(state.document, taskId, {updatedAt: timestamp, status: TaskStatus.OPEN});
    updatedDoc = updateTaskListChange(updatedDoc, task.taskListId, {updatedAt: timestamp});
    dispatch(updateDocument(updatedDoc));
  }
}

export function deleteTask(taskId: string): AppThunk {
  return (dispatch, getState) => {
    const state = getState();
    const updatedDoc = deleteTaskChange(state.document, taskId);
    dispatch(updateDocument(updatedDoc));
  }
}
