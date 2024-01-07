export enum ActionStatus {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error"
}

export enum ApplicationErrorType {
  ENTITY_NOT_FOUND = 'entity-not-found',
  ENTITY_WITHOUT_VERSION = 'entity-without-version',
  UNEXPECTED = 'unexpected'
}

export interface ApplicationError {
  type: ApplicationErrorType
  userMessage?: string
  devMessage?: string,
  context?: Error | string
}

export type ActionResult<Data = undefined> = {
  status: ActionStatus.LOADING,
  data: null
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
