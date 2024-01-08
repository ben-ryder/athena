export enum ActionStatus {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error"
}

export enum ApplicationErrorType {
  ENTITY_NOT_FOUND = 'entity-not-found',
  ENTITY_WITHOUT_VERSION = 'entity-without-version',
  USER_UNEXPECTED = 'user-unexpected',
  INTERNAL_UNEXPECTED = 'internal-unexpected'
}

export interface ApplicationError {
  type: ApplicationErrorType
  userMessage?: string
  devMessage?: string,
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

export type QueryResult<Data = undefined> = {
  status: ActionStatus.LOADING,
} | {
  status: ActionStatus.SUCCESS,
  data: Data,
  errors?: ApplicationError[]
} | {
  status: ActionStatus.ERROR,
  errors: ApplicationError[]
}


export const LOADING_STATUS: {status: ActionStatus.LOADING} = {
  status: ActionStatus.LOADING,
}
