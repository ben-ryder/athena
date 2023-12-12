import { Entity, EntityTable } from "../../common/entity.types";
import { OrderByFields, OrderDirection } from "../../common/lists.types";

/**
 * Notes
 */
export interface NoteContent {
  name: string;
  body: string;
  tags: string[];
}
export interface NoteEntity extends Entity, NoteContent {}
export type NotesTable = EntityTable<NoteEntity>;

/**
 * Note Views
 */
export interface NoteViewContent {
  name: string
  tags: string[]
  orderBy: OrderByFields;
  orderDirection: OrderDirection;
}
export interface NoteViewEntity extends Entity, NoteViewContent {}
export type NoteViewsTable = EntityTable<NoteViewEntity>;
