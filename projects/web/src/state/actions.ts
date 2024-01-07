export enum ApplicationErrorType {
  ENTITY_MISSING = 'entity-missing',
  ENTITY_NOT_FOUND = 'entity-not-found',
  UNEXPECTED = 'unexpected'
}

export interface ApplicationError {
  type: ApplicationErrorType
  userMessage?: string
  description?: string,
  context?: Error | string
}


export type ActionResult<Data = undefined> = {
  success: true,
  data: Data,
  errors?: ApplicationError[]
} | {
  success: false,
  errors: ApplicationError[]
}
