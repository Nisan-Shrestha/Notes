import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Category name is required"),
  }),
});

export const categoryIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid category ID" }),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid category ID" }),
  }),
  body: z.object({
    name: z.string().min(1),
  }),
});

export const listCategoriesQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    search: z.string().optional(),
    sortBy: z
      .enum(["asc", "desc"], {
        invalid_type_error: "SortOrder must be 'asc' or 'desc'",
      })
      .optional()
      .default("asc"),
  }),
});

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>["body"] & {
  ownerId: string;
};

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>["body"];

export type ListCategoriesQueryDTO = z.infer<
  typeof listCategoriesQuerySchema
>["query"];
