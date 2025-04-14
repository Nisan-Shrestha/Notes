import { z } from "zod";

export const createNoteSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().optional(),
    categoryIds: z
      .array(z.string().uuid(), {
        invalid_type_error: "categoryIds must be an array of UUIDs",
      })
      .optional(),
  }),
});

export const noteIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid note ID" }),
  }),
});

export const updateNoteSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid note ID" }),
  }),
  body: z
    .object({
      title: z.string().min(1).optional(),
      content: z.string().optional(),
      categoryIds: z.array(z.string().uuid()).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    }),
});

export const listNotesQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    categoryIds: z
      .string()
      .optional()
      .transform((val) => (val ? val.split(",") : undefined))
      .pipe(z.array(z.string().uuid()).optional()),
    sortBy: z
      .enum(["asc", "desc"], {
        invalid_type_error: "SortOrder must be 'asc' or 'desc'",
      }).optional().default("desc"),
    search: z.string().optional(),
  }),
});

export type CreateNoteDTO = z.infer<typeof createNoteSchema>["body"] & {
  authorId: string;
};
export type UpdateNoteDTO = z.infer<typeof updateNoteSchema>["body"];

export type ListNotesQueryDTO = z.infer<typeof listNotesQuerySchema>["query"];
