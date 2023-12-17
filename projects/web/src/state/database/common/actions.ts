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

export type CreateActionResponse = {
  success: true
  id: string
} | {
  success: false,
  error: ApplicationError
}

export function existsInTable<T>(table: GenericTable<T>, id: string): boolean {
  return table.ids.includes(id) && table.entities[id] !== 'undefined'
}

export function listRequiresUpdate<T>(current: T[], update: T[]): boolean {
  // Return immediately if length is different, no need to check anything else
  if (update.length !== current.length) {
    return true;
  }

  // Calculate values that are only in current or update, but not both (xor)
  const differences =
    current.filter(x => !update.includes(x))
    .concat(update.filter(x => !current.includes(x)));

  return differences.length !== 0
}