import { courseEnrollableSchema } from "@/server/api/crud/course-enrolments/types";
import { z } from "zod";

export const columnSchema = courseEnrollableSchema;

export type ColumnSchema = z.infer<typeof columnSchema>;

export const columnFilterSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});
