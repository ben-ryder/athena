/**
 * Base Entities
 */
export enum ContentTypes {
  TAG = "TAG",
  NOTE = "NOTE",
  NOTE_TEMPLATE = "NOTE-TEMPLATE",
  TASK = "TASK",
  REMINDER = "REMINDER",
  VIEW = "VIEW"
}

export interface Entity {
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
 * Notes Custom Fields
 * ========================
 */
export enum CustomFieldType {
  TEXT_SHORT = "text-short",
  TEXT_LONG = "text-long",
  URL = "url",
  NUMBER = "number",
  SCALE = "scale",
  BOOLEAN = "boolean",
  DATE = "date",
  TIMESTAMP = "timestamp"
}

export interface CustomFieldBase {
  identifier: string,
  label: string
}

export interface CustomFieldTextContent extends CustomFieldBase {
  value: string
}
export interface CustomFieldTextShort extends CustomFieldTextContent {
  type: CustomFieldType.TEXT_SHORT
}
export interface CustomFieldTextLong extends CustomFieldTextContent {
  type: CustomFieldType.TEXT_LONG,
}
export interface CustomFieldURL extends CustomFieldTextContent {
  type: CustomFieldType.URL,
}

export interface CustomFieldNumberContent extends CustomFieldBase {
  value: number
}
export interface CustomFieldNumber extends CustomFieldNumberContent {
  type: CustomFieldType.NUMBER
}
export interface CustomFieldScale extends CustomFieldNumberContent {
  type: CustomFieldType.SCALE,
  maxValue: number
}

export interface CustomFieldBoolean extends CustomFieldBase {
  type: CustomFieldType.BOOLEAN
  value: boolean
}

export interface CustomFieldTimestamp extends CustomFieldBase {
  type: CustomFieldType.TIMESTAMP
}
export interface CustomFieldDate extends CustomFieldBase {
  type: CustomFieldType.DATE,
}

export type CustomField =
  CustomFieldTextShort | CustomFieldTextLong |
  CustomFieldURL|
  CustomFieldNumber | CustomFieldScale |
  CustomFieldBoolean |
  CustomFieldTimestamp | CustomFieldDate;


/**
 * Notes & Note Templates
 * ========================
 */
export interface NoteContent {
  name: string,
  body: string,
  tags: string[],
  customFields: CustomField[]
}
export interface NoteEntity extends Entity, NoteContent {}
export type NotesTable = EntityTable<NoteEntity>;

export interface NoteTemplateContent extends NoteContent {}
export interface NoteTemplateEntity extends Entity, NoteTemplateContent {}
export type NoteTemplatesTable = EntityTable<NoteTemplateEntity>;


/**
 * Tags
 * ========================
 */
export interface TagContent {
  name: string,
  textColour: string,
  backgroundColour: string,
}
export interface TagEntity extends Entity, TagContent {}
export type TagsTable = EntityTable<TagEntity>;


/**
 * Tasks
 * ========================
 */
export interface TaskContent {
  name: string,
  tags: string[],
  reminderRRULE?: string
}
export interface TaskEntity extends Entity, TaskContent {}
export type TasksTable = EntityTable<TaskEntity>;


/**
 * Views
 * ========================
 */
export enum ViewOrderByFields {
  CREATED_AT = "createdAt",
  UPDATED_AT = "updatedAt",
  NAME = "name"
}
export enum ViewOrderDirection {
  ASC = "asc",
  DESC = "desc",
}

export interface ViewContent {
  name: string,
  tags: string[],
  orderBy: ViewOrderByFields,
  orderDirection: ViewOrderDirection,
  limit: number
}

export interface ViewEntity extends Entity, ViewContent {}
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
    views: ViewsTable
  },
  tasks: {
    content: TasksTable,
    views: ViewsTable
  }
}
