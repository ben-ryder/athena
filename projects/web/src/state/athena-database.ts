import { TagsTable } from "./features/tags/tags.types.js";
import { NoteListsTable, NotesTable } from "./features/notes/notes.types.js";
import { TaskListsTable, TasksTable } from "./features/tasks/tasks.types.js";
import { PagesTable } from "./features/pages/pages.types.js";
import { Settings } from "./features/settings/settings.types.js";


/**
 * Database
 * ========================
 */
export interface AthenaDatabase {
  tags: {
    content: TagsTable;
  };
  notes: {
    content: NotesTable;
    lists: NoteListsTable;
  };
  tasks: {
    content: TasksTable;
    lists: TaskListsTable
  };
  pages: {
    content: PagesTable
  };
  settings: Settings
}
