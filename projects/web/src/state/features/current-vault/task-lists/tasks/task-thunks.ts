import {ApplicationState, AppThunkDispatch} from "../../../../store";
import {v4 as createUUID} from "uuid";
import {DatabaseTask, TaskStatus} from "./task-interface";
import {createTask, updateTask} from "./task-actions";
import {updateTaskList} from "../task-lists-actions";


export function createNewTask(taskListId: string, name: string) {
  return (dispatch: AppThunkDispatch) => {
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
    dispatch(createTask(task));

    dispatch(updateTaskList({
      id: taskListId,
      changes: {
        updatedAt: timestamp
      }
    }))
  }
}

export function renameTask(taskId: string, name: string) {
  return (dispatch: AppThunkDispatch, getState: () => ApplicationState) => {
    const state = getState();
    const task = state.currentVault.tasks.entities[taskId]
    const updatedAt = new Date().toISOString();

    dispatch(updateTask({
      id: taskId,
      changes: {
        name: name,
        updatedAt: updatedAt
      }
    }));

    dispatch(updateTaskList({
      id: task.taskListId,
      changes: {
        updatedAt: updatedAt
      }
    }))
  }
}

export function completeTask(taskId: string) {
  return (dispatch: AppThunkDispatch, getState: () => ApplicationState) => {
    const state = getState();
    const task = state.currentVault.tasks.entities[taskId]
    const updatedAt = new Date().toISOString();

    dispatch(updateTask({
      id: taskId,
      changes: {
        status: TaskStatus.COMPLETED,
        updatedAt: updatedAt
      }
    }));

    dispatch(updateTaskList({
      id: task.taskListId,
      changes: {
        updatedAt: updatedAt
      }
    }))
  }
}

export function reopenTask(taskId: string) {
  return (dispatch: AppThunkDispatch, getState: () => ApplicationState) => {
    const state = getState();
    const task = state.currentVault.tasks.entities[taskId]
    const updatedAt = new Date().toISOString();

    dispatch(updateTask({
      id: taskId,
      changes: {
        status: TaskStatus.OPEN,
        updatedAt: updatedAt
      }
    }));

    dispatch(updateTaskList({
      id: task.taskListId,
      changes: {
        updatedAt: updatedAt
      }
    }))
  }
}
