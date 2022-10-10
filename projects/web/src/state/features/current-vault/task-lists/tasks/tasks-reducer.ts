import {createReducer} from "@reduxjs/toolkit";

import {createTask, deleteTask, updateTask} from "./task-actions";
import {taskAdapter} from "./task-adapter";
import {TasksState} from "./task-interface";

export const initialTasks: TasksState = {
  entities: {},
  ids: []
};

export const tasksReducer = createReducer(
  initialTasks,
  (builder) => {
    builder.addCase(createTask, taskAdapter.addOne)
    builder.addCase(updateTask, taskAdapter.updateOne);
    builder.addCase(deleteTask, taskAdapter.removeOne);
  }
);
