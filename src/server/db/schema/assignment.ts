import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "@/lib/utils";

import { ID_LENGTH } from "./config";
import { courses } from "./course";
import { createTable, generateId } from "./util";

export const assignments = createTable("assignment", {
  id: varchar("id", { length: ID_LENGTH })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("ass")),
  courseId: varchar("course_id", { length: ID_LENGTH })
    .notNull()
    .references(() => courses.id, {
      onUpdate: "no action",
      onDelete: "cascade",
    }),
  name: text("name"),
  editorId: text("editor_id"),
  availableAt: timestamp("available_at", {
    mode: "date",
    withTimezone: true,
  }),
  nextDeadline: timestamp("next_deadline", {
    mode: "date",
    withTimezone: true,
  }),
  weighting: integer("weighting").notNull().default(0),
  isGroup: boolean("is_group").notNull().default(false),
  isSelfEnrol: boolean("is_self_enrol").notNull().default(false),
  isTutorialGrouping: boolean("is_tutorial_grouping").notNull().default(false),
  maxGroupSize: integer("max_group_size").notNull().default(1),
  isArchived: boolean("is_archived").notNull().default(false),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

const baseAssignmentSchema = createSelectSchema(assignments).omit(timestamps);

export const insertAssignmentSchema =
  createInsertSchema(assignments).omit(timestamps);
export const insertAssignmentParams = baseAssignmentSchema.pick({
  courseId: true,
});

export const updateAssignmentSchema = baseAssignmentSchema;
export const updateAssignmentParams = baseAssignmentSchema.extend({
  name: z.string().min(1, "Assignment name is required."),
  weighting: z.coerce
    .number()
    .int()
    .refine((val: number) => {
      return val >= 0 && val <= 100;
    }, "Weighting must be an integer between 0 and 100."),
  availableAt: z.date().nullable(),
  editorId: z.string().nullable(),
  maxGroupSize: z.coerce
    .number({ invalid_type_error: "Max team size must be a number" })
    .positive("Team Size must be positive"),
});

export const deleteAssignmentSchema = baseAssignmentSchema.pick({
  id: true,
  courseId: true,
});
export const deleteAssignmentParams = baseAssignmentSchema.pick({
  id: true,
  courseId: true,
});

export const assignmentIdSchema = baseAssignmentSchema.pick({ id: true });
export type Assignment = z.infer<typeof baseAssignmentSchema>;
export type NewAssignmentParams = z.infer<typeof insertAssignmentParams>;
export type UpdateAssignmentParams = z.infer<typeof updateAssignmentParams>;
export type DeleteAssignmentParams = z.infer<typeof deleteAssignmentParams>;
export type AssignmentId = z.infer<typeof assignmentIdSchema>["id"];
