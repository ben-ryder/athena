import {combineReducers} from "@reduxjs/toolkit";
import {notesReducer} from "./notes/notes-reducer";
import {noteTemplatesReducer} from "./note-templates/note-templates-reducer";
import {taskListsReducer} from "./task-lists/task-lists-reducer";
import {tagsReducer} from "./tags/tags-reducer";
import {notesTagsReducer} from "./notes-tags/notes-tags-reducer";
import {noteTemplateTagsReducer} from "./note-templates-tags/note-template-tags-reducer";
import {taskListsTagsReducer} from "./task-lists-tags/task-lists-tags-reducer";
import {foldersReducer} from "./folders/folders-reducer";

export const currentVaultReducer = combineReducers({
  tags: tagsReducer,
  notes: notesReducer,
  notesTags: notesTagsReducer,
  noteTemplates: noteTemplatesReducer,
  noteTemplatesTags: noteTemplateTagsReducer,
  taskLists: taskListsReducer,
  taskListsTags: taskListsTagsReducer,
  folders: foldersReducer
})
