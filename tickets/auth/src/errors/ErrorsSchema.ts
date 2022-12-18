export interface ErrorsSchema {
  errors: ErrorListSchema
}

export type ErrorListSchema = Array<{
  message: string
  field?: string
}>
