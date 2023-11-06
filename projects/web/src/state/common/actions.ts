import { EntityTable } from "./entity.types";

const CorruptMessage = "You should IMMEDIATELY manually backup all content and seek help on GitHub as your data may be corrupt."

export const GenericErrorMessage = "There was an unexpected error completing that operation. Please try again and/or raise a GitHub issue."
export const GenericNotFoundOnUpdateMessage = `The content you attempted to update could not be found. ${CorruptMessage}`
export const GenericNotFoundOnDeleteMessage = `The content you attempted to delete could not be found. ${CorruptMessage}`

export type ActionResponse = {
  success: true
} | {
  success: false,
  errorMessage: string,
  context?: any
}

export async function existsInTable(table: EntityTable<any>, id: string): Promise<boolean> {
  return table.ids.includes(id) && table.entities[id]
}
