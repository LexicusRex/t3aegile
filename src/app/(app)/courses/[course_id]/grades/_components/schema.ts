import { z } from "zod";

import {
  ARRAY_DELIMITER,
  RANGE_DELIMITER,
  SLIDER_DELIMITER,
} from "@/components/fancy-data-table/schema";

// export const REGIONS = ["ams", "gru", "syd", "hkg", "fra", "iad"] as const;
// export const TAGS = ["web", "api", "enterprise", "app"] as const;

// https://github.com/colinhacks/zod/issues/2985#issue-2008642190
const stringToBoolean = z
  .string()
  .toLowerCase()
  .transform((val) => {
    try {
      return JSON.parse(val) as boolean;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  })
  .pipe(z.boolean().optional());

// REMINDER: If the field doesn't have fixed values across all variable instances of the table, use string(), not enum().
// Since if you know the values are fixed, you can use hardcode the enum.
export const columnSchema = z.object({
  name: z.string(),
  url: z.string(),
  // p75
  p95: z.number().optional(),
  // p99
  public: z.boolean(),
  active: z.boolean(),
  // regions: z.enum(REGIONS).array(),
  // tags: z.enum(TAGS).array(),
  regions: z.string().array(),
  tags: z.string().array(),
  date: z.date(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;

// FIXME: checkbox filter fields where you want to filter across multiple options
//        must have enum to work with the input command

export function extractUniqueValues(data: ColumnSchema[]) {
  const regions = new Set<string>();
  const tags = new Set<string>();

  data.forEach((item: ColumnSchema) => {
    if (item.regions) {
      item.regions.forEach((region) => regions.add(region));
    }
    if (item.tags) {
      item.tags.forEach((tag) => tags.add(tag));
    }
  });

  return {
    REGIONS: Array.from(regions) as [string, ...string[]],
    TAGS: Array.from(tags) as [string, ...string[]],
  };
}

export function generateFilterSchema(data: ColumnSchema[]) {
  const { REGIONS, TAGS } = extractUniqueValues(data);
  const columnFilterSchema = z.object({
    name: z.string().optional(),
    url: z.string().optional(),
    p95: z.coerce
      .number()
      .or(
        z
          .string()
          .transform((val) => val.split(SLIDER_DELIMITER))
          .pipe(z.coerce.number().array().length(2)),
      )
      .optional(), // TBD: we could transform to `{ min: x, max: y}`
    public: z
      .string()
      .transform((val) => val.split(ARRAY_DELIMITER))
      .pipe(stringToBoolean.array())
      .optional(),
    active: z
      .string()
      .transform((val) => val.split(ARRAY_DELIMITER))
      .pipe(stringToBoolean.array())
      .optional(),
    regions: z
      .enum(REGIONS)
      .or(
        z
          .string()
          .transform((val) => val.split(ARRAY_DELIMITER))
          .pipe(z.enum(REGIONS).array()),
      )
      .optional(),
    tags: z
      .enum(TAGS)
      .or(
        z
          .string()
          .transform((val) => val.split(ARRAY_DELIMITER))
          .pipe(z.enum(TAGS).array()),
      )
      .optional(),
    date: z.coerce
      .number()
      .pipe(z.coerce.date())
      .or(
        z
          .string()
          .transform((val) => val.split(RANGE_DELIMITER).map(Number))
          .pipe(z.coerce.date().array()),
      )
      .optional(),
  });

  return columnFilterSchema;
}
