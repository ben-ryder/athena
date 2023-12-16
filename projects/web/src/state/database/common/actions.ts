import {GenericTable} from "./entity";
import { ApplicationError } from "./errors";

const CorruptMessage = "You should IMMEDIATELY manually backup all content and seek help on GitHub as your data may be corrupt."

export const GenericErrorMessage = "An unexpected error has occurred. Please try again and/or raise a GitHub issue."
export const GenericNotFoundOnUpdateMessage = `The content you attempted to update could not be found. ${CorruptMessage}`
export const GenericNotFoundOnDeleteMessage = `The content you attempted to delete could not be found. ${CorruptMessage}`

export type ActionResponse = {
  success: true
} | {
  success: false,
  error: ApplicationError
}

export function existsInTable<T>(table: GenericTable<T>, id: string): boolean {
  return table.ids.includes(id) && table.entities[id] !== 'undefined'
}
