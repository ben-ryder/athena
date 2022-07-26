import {z} from "zod";

/**
 * Pagination query parameters.
 */
export const PaginationQueryParamsSchema = z.object({
  take: z.number().int().positive().optional(),
  skip: z.number().int().positive().optional()
}).strict();

export type PaginationQueryParams = z.infer<typeof PaginationQueryParamsSchema>;
