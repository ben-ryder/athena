import { TagsTable } from "./tag";
import { NoteListsTable, NotesTable } from "./notes";
import { TaskListsTable, TasksTable } from "./tasks";
import { PagesTable } from "./pages";
import { Settings } from "./settings";


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
