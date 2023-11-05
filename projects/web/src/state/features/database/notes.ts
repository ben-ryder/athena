import { Entity, EntityTable } from "./entity";
import { OrderByFields, OrderDirection } from "../../common/lists";

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
 * Note Lists
 */
export interface NoteListContent {
  name: string
  tags: string[]
  orderBy: OrderByFields;
  orderDirection: OrderDirection;
}
export interface NoteListEntity extends Entity, NoteListContent {}
export type NoteListsTable = EntityTable<NoteListEntity>;
