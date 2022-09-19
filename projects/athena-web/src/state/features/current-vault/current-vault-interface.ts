import {FoldersState} from "./folders/folders-interface";
import {NoteTemplatesState} from "./note-templates/note-templates-interface";
import {NotesState} from "./notes/notes-interface";
import {NotesTagsState} from "./notes-tags/note-tags-interface";
import {QueriesState} from "./queries/queries-interface";
import {QueriesTagsState} from "./queries-tags/queries-tags-interface";
import {TagsState} from "./tags/tags-interface";
import {TaskListsState} from "./task-lists/task-lists-interface";
import {TaskListsTagsState} from "./task-lists-tags/task-list-tags-interface";
import {NoteTemplatesTagsState} from "./note-templates-tags/note-template-tags-interface";

export interface CurrentVaultInterface {
  folders: FoldersState,
  noteTemplates: NoteTemplatesState,
  noteTemplatesTags: NoteTemplatesTagsState,
  notes: NotesState,
  notesTags: NotesTagsState,
  // queries: QueriesState,
  // queriesTags: QueriesTagsState,
  tags: TagsState,
  taskLists: TaskListsState
  taskListsTags: TaskListsTagsState
}