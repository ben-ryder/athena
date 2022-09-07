import {combineReducers} from "@reduxjs/toolkit";
import {notesReducer} from "./notes/notes-reducer";
import {templatesReducer} from "./templates/templates-reducer";
import {taskListsReducer} from "./task-lists/task-lists-reducer";
import {tagsReducer} from "./tags/tags-reducer";
import {notesTagsReducer} from "./notes-tags/notes-tags-reducer";
import {templatesTagsReducer} from "./templates-tags/templates-tags-reducer";
import {taskListsTagsReducer} from "./task-lists-tags/task-lists-tags-reducer";

export const openVaultReducer = combineReducers({
  tags: tagsReducer,
  notes: notesReducer,
  notesTags: notesTagsReducer,
  templates: templatesReducer,
  templatesTags: templatesTagsReducer,
  taskLists: taskListsReducer,
  taskListsTags: taskListsTagsReducer
})
