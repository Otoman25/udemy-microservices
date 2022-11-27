export type ErrorsSchema = {
    errors: ErrorListSchema
};

export type ErrorListSchema = {
    message: string,
    field?: string,
}[];