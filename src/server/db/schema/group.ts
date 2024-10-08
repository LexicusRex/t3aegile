import { sql } from "drizzle-orm";
import { text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "@/lib/utils";

import { assignments } from "./assignment";
import { ID_LENGTH } from "./config";
import { createTable, generateId } from "./util";

/**
 * The schema for the `groups` table.
 *
 * @remarks
 * This table stores groups. Groups are used to group students together for a specific assignment.
 * Groups are associated with one and only one specific assignment.
 *
 */

export const groups = createTable(
  "group",
  {
    id: varchar("id", { length: ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId("grp")),
    assignmentId: varchar("assignment_id", { length: ID_LENGTH })
      .notNull()
      .references(() => assignments.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
    name: text("name").notNull(),
    // submissionsFulfilled: integer("submissions_fulfilled").notNull().default(0),
    // submissionsUnfulfilled: integer("submissions_unfulfilled")
    //   .notNull()
    //   .default(0),
    identifier: text("identifier").notNull(),

    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    uniqueGroupName: unique().on(t.assignmentId, t.name),
    uniqueGroupIdentifier: unique().on(t.assignmentId, t.identifier),
  }),
);

const baseSchema = createSelectSchema(groups).omit(timestamps);

const zodGroupSchemaExtension = {
  assignmentId: z.string().length(ID_LENGTH, "Invalid assignment ID"),
  name: z.string().min(3, "Group name must be at least 3 characters."),
  identifier: z
    .string()
    .min(3, "Identifier must be at least 3 characters")
    .toUpperCase(),
};

export const insertGroupSchema = createInsertSchema(groups)
  .omit({ ...timestamps, id: true })
  .extend(zodGroupSchemaExtension);

export const updateGroupSchema = baseSchema.extend(zodGroupSchemaExtension);

export type Group = typeof groups.$inferSelect;
export type NewGroup = z.infer<typeof insertGroupSchema>;
export type ModifiedGroup = z.infer<typeof updateGroupSchema>;
