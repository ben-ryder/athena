/**
 * Base Entities
 */

export enum ContentTypes {
  TAG = "TAG",
  NOTE = "NOTE",
  NOTE_TEMPLATE = "NOTE-TEMPLATE",
  TASK = "TASK",
  JOURNAL_ENTRY = "JOURNAL-ENTRY",
  JOURNAL_TEMPLATE = "JOURNAL-TEMPLATE",
  REMINDER = "REMINDER",
  VIEW = "VIEW"
}

export interface EntityContent {
  name: string,
  description?: string,
}

export interface Entity {
  type: ContentTypes
  id: string,
  createdAt: string,
  updatedAt: string,
}

export interface EntityTable<T> {
  entities: {[key: string]: T},
  ids: string[]
}

export type EntityWithoutId<T> = Omit<T, "id">;

/**
 * Notes
 * ========================
 */
export interface NoteContent extends EntityContent {
  body: string,
  tags: string[]
}
export interface NoteEntity extends Entity, NoteContent {
  type: ContentTypes.NOTE
}
export type NotesTable = EntityTable<NoteEntity>;


/**
 * Note Templates
 * ========================
 */
export interface NoteTemplateContent extends NoteContent {}
export interface NoteTemplateEntity extends Entity, NoteTemplateContent {
  type: ContentTypes.NOTE_TEMPLATE
}
export type NoteTemplatesTable = EntityTable<NoteTemplateEntity>;


/**
 * Tags
 * ========================
 */
export interface TagContent extends EntityContent {
  textColour: string,
  backgroundColour: string,
}
export interface TagEntity extends Entity, TagContent {
  type: ContentTypes.TAG
}
export type TagsTable = EntityTable<TagEntity>;


/**
 * Tasks
 * ========================
 */
export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in-progress",
  DONE = "done",
  REMOVED = "removes"
}

export enum TaskPriority {
  NEUTRAL = "neutral",
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export interface TaskContent extends EntityContent {
  status: TaskStatus,
  priority: TaskPriority,
  tags: string[]
}
export interface TaskEntity extends Entity, TaskContent {
  type: ContentTypes.TASK
}
export type TasksTable = EntityTable<TaskEntity>;


/**
 * Journal
 * ========================
 */
export enum JournalQuestionType {
  TEXT_SHORT = "text-short",
  TEXT_LONG = "text-long",
  SCALE = "scale",
  BOOLEAN = "boolean"
}

export interface JournalQuestionTextContent {
  id: string,
  question: string,
  value: string
}
export interface JournalQuestionTextShort extends JournalQuestionTextContent {
  type: JournalQuestionType.TEXT_SHORT
}
export interface JournalQuestionTextLong extends JournalQuestionTextContent {
  type: JournalQuestionType.TEXT_LONG,
}
export interface JournalQuestionScale {
  id: string,
  type: JournalQuestionType.SCALE,
  question: string,
  maxValue: number,
  value: number
}
export interface JournalQuestionBoolean {
  id: string,
  type: JournalQuestionType.BOOLEAN,
  question: string,
  value: boolean
}

export type JournalQuestion = JournalQuestionTextShort | JournalQuestionTextLong | JournalQuestionScale | JournalQuestionBoolean;

export interface JournalEntryContent extends EntityContent {
  questions: JournalQuestion[],
  body: string
}

export interface JournalTemplateEntity extends Entity, JournalEntryContent {
  type: ContentTypes.JOURNAL_TEMPLATE
}
export type JournalTemplatesTable = EntityTable<JournalTemplateEntity>;
export interface JournalEntryEntity extends Entity, JournalEntryContent {
  type: ContentTypes.JOURNAL_ENTRY
}
export type JournalEntriesTable = EntityTable<JournalEntryEntity>;


/**
 * Reminders
 * ========================
 */
export interface ReminderContent extends EntityContent {
  rrule: string,
  tags: string[]
}
export interface ReminderEntity extends Entity, ReminderContent {
  type: ContentTypes.REMINDER
}
export type RemindersTable = EntityTable<ReminderEntity>;


/**
 * Views
 * ========================
 */
export enum OrderByFields {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  NAME = "name",
  TASK_STATUS = "status",
  TASK_PRIORITY = "priority"
}
export enum OrderDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface ViewContent extends EntityContent {
  filterQuery: string,
  tags: string[],
  pinned: boolean
}

export interface ViewEntity extends Entity, ViewContent {
  type: ContentTypes.VIEW
}
export interface ViewsTable extends EntityTable<ViewEntity> {}


/**
 * Database
 * ========================
 */
export interface AthenaDatabase {
  tags: {
    content: TagsTable
  },
  notes: {
    content: NotesTable,
    templates: NoteTemplatesTable,
  }
  tasks: {
    content: TasksTable
  },
  journal: {
    content: JournalEntriesTable,
    templates: JournalTemplatesTable
  },
  reminders: {
    content: RemindersTable,
  },
  views: {
    content: ViewsTable
  }
}
