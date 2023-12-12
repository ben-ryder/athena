import { TagsTable } from "./features/tags/tags.types";
import { NoteViewsTable, NotesTable } from "./features/notes/notes.types";
import { TaskViewsTable, TasksTable } from "./features/tasks/tasks.types";
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
    views: NoteViewsTable;
  };
  tasks: {
    content: TasksTable;
    views: TaskViewsTable
  };
  settings: Settings
}
