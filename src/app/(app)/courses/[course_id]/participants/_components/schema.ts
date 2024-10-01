import { z } from "zod";

import { ARRAY_DELIMITER } from "@/components/fancy-data-table/schema";

export const columnSchema = z.object({
  name: z.string().optional().nullable(),
  email: z.string(),
  image: z.string().optional().nullable(),
  role: z.string(),
  tutorials: z.string().array(),
  // date: z.date(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;

export function extractUniqueValues(data: ColumnSchema[]) {
  const tuts = new Set<string>();
  const roles = new Set<string>();

  data.forEach((item: ColumnSchema) => {
    if (item.role) {
      roles.add(item.role);
    }
    if (item.tutorials) {
      item.tutorials.forEach((tutorial) => tuts.add(tutorial));
    }
  });

  return {
    ROLES: Array.from(roles) as [string, ...string[]],
    TUTORIALS: Array.from(tuts) as [string, ...string[]],
  };
}

// REMINDER: enums must be used for checkbox filter fields where you want to filter across multiple options to work with the input command.
//            Filter values with spaces in won't work without this enum
export function generateFilterSchema(data: ColumnSchema[]) {
  const { ROLES, TUTORIALS } = extractUniqueValues(data);
  const columnFilterSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    image: z.string().optional(),
    role: z
      .enum(ROLES)
      .or(
        z
          .string()
          .transform((val) => val.split(ARRAY_DELIMITER))
          .pipe(z.enum(ROLES).array()),
      )
      .optional(),
    tutorials: z
      .enum(TUTORIALS)
      .or(
        z
          .string()
          .transform((val) => val.split(ARRAY_DELIMITER))
          .pipe(z.enum(TUTORIALS).array()),
      )
      .optional(),
  });
  return columnFilterSchema;
}
