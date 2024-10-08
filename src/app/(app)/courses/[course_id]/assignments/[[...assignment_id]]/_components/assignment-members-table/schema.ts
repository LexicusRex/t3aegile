import { z } from "zod";

import { ARRAY_DELIMITER } from "@/components/fancy-data-table/schema";

export const columnSchema = z.object({
  userId: z.string(), // User ID
  name: z.string().nullable(),
  email: z.string(),
  tutorials: z.string().array(),
  group: z.string().nullable(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;

export function extractUniqueValues(data: ColumnSchema[]) {
  const tuts = new Set<string>();
  const groups = new Set<string>();

  data.forEach((item: ColumnSchema) => {
    if (item.tutorials) {
      item.tutorials.forEach((tutorial) => tuts.add(tutorial));
    }
    if (item.group) {
      groups.add(item.group);
    }
  });

  return {
    TUTORIALS: Array.from(tuts) as [string, ...string[]],
    GROUPS: Array.from(groups) as [string, ...string[]],
  };
}

// REMINDER: enums must be used for checkbox filter fields where you want to filter across multiple options to work with the input command.
//            Filter values with spaces in won't work without this enum
export function generateFilterSchema(data: ColumnSchema[]) {
  const { TUTORIALS, GROUPS } = extractUniqueValues(data);
  const columnFilterSchema = z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    tutorials: z
      .enum(TUTORIALS)
      .or(
        z
          .string()
          .transform((val) => val.split(ARRAY_DELIMITER))
          .pipe(z.enum(TUTORIALS).array()),
      )
      .optional(),
    group: z
      .enum(GROUPS)
      .or(
        z
          .string()
          .transform((val) => val.split(ARRAY_DELIMITER))
          .pipe(z.enum(GROUPS).array()),
      )
      .optional(),
  });
  return columnFilterSchema;
}
