import { sql } from "drizzle-orm";
import { numeric, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "@/lib/utils";

import { assignments } from "./assignment";
import { ID_LENGTH } from "./config";
import { courseIdSchema } from "./course";
import { createTable, generateId } from "./util";

export const deliverables = createTable(
  "deliverable",
  {
    id: varchar("id", { length: ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId("ass")),
    assignmentId: varchar("assignment_id", { length: ID_LENGTH })
      .notNull()
      .references(() => assignments.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
    name: text("name").notNull().default("Untitled Deliverable"),
    description: text("description"),
    availableAt: timestamp("available_at", {
      mode: "date",
      withTimezone: true,
    }),
    deadline: timestamp("deadline", {
      mode: "date",
      withTimezone: true,
    }),
    cutoff: timestamp("cutoff", {
      mode: "date",
      withTimezone: true,
    }),
    weighting: numeric("weighting").notNull().default("0"),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({ uniqueAssignmentDeliverable: unique().on(t.assignmentId, t.name) }),
);

const baseDeliverableSchema = createSelectSchema(deliverables).omit(timestamps);

export const insertDeliverableSchema = createInsertSchema(deliverables);
export const insertDeliverableParams = baseDeliverableSchema
  .extend({
    name: z.string().min(1, { message: "Deliverable name is required." }),
    weighting: z.string().refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 100;
      },
      { message: "Weighting must be an integer between 0 and 100." },
    ),
    availableAt: z.date().nullable(),
    deadline: z.date().nullable(),
    cutoff: z.date().nullable(),
    courseId: z.string(),
  })
  .omit({ id: true });

export const updateDeliverableSchema = baseDeliverableSchema;
export const updateDeliverableParams = baseDeliverableSchema.extend({
  name: z.string().min(1, { message: "Deliverable name is required." }),
  weighting: z.string().refine(
    (val) => {
      const num = Number(val);
      return !isNaN(num) && Number.isInteger(num) && num >= 0 && num <= 100;
    },
    { message: "Weighting must be an integer between 0 and 100." },
  ),
  availableAt: z.date().nullable(),
  deadline: z.date().nullable(),
  cutoff: z.date().nullable(),
  courseId: courseIdSchema.shape.id,
});

export const deleteDeliverableSchema = baseDeliverableSchema
  .pick({
    id: true,
  })
  .extend({
    courseId: courseIdSchema.shape.id,
  });

export const deliverableIdSchema = baseDeliverableSchema.pick({ id: true });

export type Deliverable = z.infer<typeof baseDeliverableSchema>;
export type NewDeliverableParams = z.infer<typeof insertDeliverableParams>;
export type UpdateDeliverableParams = z.infer<typeof updateDeliverableParams>;
export type DeleteDeliverableParams = z.infer<typeof deleteDeliverableSchema>;
export type DeliverableId = z.infer<typeof deliverableIdSchema>["id"];
