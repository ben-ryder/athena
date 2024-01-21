
export enum ErrorTypes {
  ENTITY_NOT_FOUND = 'entity-not-found',
  ENTITY_WITHOUT_VERSION = 'entity-without-version',
  VERSION_NOT_FOUND = 'version-not-found',
  INVALID_OR_CORRUPTED_DATA = 'invalid-or-corrupted-data',
  SYSTEM_EXCEPTION = 'system-exception',
}

export interface ErrorObject {
  type: ErrorTypes
  userMessage?: string
  devMessage?: string,
  context?: any
}

export type ActionResult<Data = null> = {
  success: true,
  data: Data,
  errors?: ErrorObject[]
} | {
  success: false,
  errors: ErrorObject[]
}

export const QueryStatus = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error"
} as const

export type Query<Data = null> = {
  status: typeof QueryStatus.LOADING,
} | {
  status: typeof QueryStatus.SUCCESS,
  data: Data,
  errors?: ErrorObject[]
} | {
  status: typeof QueryStatus.ERROR,
  errors: ErrorObject[]
}

export const QUERY_LOADING= {
  status: QueryStatus.LOADING,
} as const
