import { sql } from "drizzle-orm";
import { integer, text, timestamp, varchar } from "drizzle-orm/pg-core";
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

export const updateAssignmentSchema = baseAssignmentSchema.omit({
  courseId: true,
});
export const updateAssignmentParams = baseAssignmentSchema
  .extend({
    name: z.string().min(1, { message: "Assignment name is required." }),
    weighting: z
      .number()
      .int()
      .min(0, { message: "Weighting must be a positive integer." })
      .max(100, { message: "Weighting must be less than or equal to 100." }),
    availableAt: z.date().nullable(),
    editorId: z.string().nullable(),
  })
  .omit({ courseId: true });

export const assignmentIdSchema = baseAssignmentSchema.pick({ id: true });
export type Assignment = z.infer<typeof baseAssignmentSchema>;
export type NewAssignmentParams = z.infer<typeof insertAssignmentParams>;
export type UpdateAssignmentParams = z.infer<typeof updateAssignmentParams>;
export type AssignmentId = z.infer<typeof assignmentIdSchema>["id"];
