import { TagsTable } from "./features/tags/tags.types";
import { NoteListsTable, NotesTable } from "./features/notes/notes.types";
import { TaskListsTable, TasksTable } from "./features/tasks/tasks.types";
import { PagesTable } from "./features/pages/pages.types";
import { Settings } from "./features/settings/settings.types";


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
