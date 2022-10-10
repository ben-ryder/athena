
export interface ApplicationError {
  heading: string,
  text: string
}

export interface UIErrorsState {
  applicationError: ApplicationError | null
}
