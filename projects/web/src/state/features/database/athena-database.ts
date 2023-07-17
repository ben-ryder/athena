import { TagsTable } from "./tag";
import { NotesTable, NoteTemplatesTable } from "./notes";
import { ViewsTable } from "./views";
import { TasksTable } from "./tasks";

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
    templates: NoteTemplatesTable;
  };
  tasks: {
    content: TasksTable;
  };
  views: {
    content: ViewsTable
  }
}
