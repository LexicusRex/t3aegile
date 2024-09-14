import { sql } from "drizzle-orm";
import { integer, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
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
    }).notNull(),
    deadline: timestamp("deadline", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    cutoff: timestamp("cutoff", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
    weighting: integer("weighting").notNull().default(0),
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
  (t) => ({ uniqueAssignmentDeliverable: unique().on(t.assignmentId, t.name) }),
);

const baseDeliverableSchema = createSelectSchema(deliverables).omit(timestamps);

export const insertDeliverableSchema = createInsertSchema(deliverables);
export const insertDeliverableParams = baseDeliverableSchema
  .extend({
    name: z.string().min(1, "Deliverable name is required."),
    weighting: z
      .number()
      .int()
      .refine((val: number) => {
        return val >= 0 && val <= 100;
      }, "Weighting must be an integer between 0 and 100."),
    availableAt: z.date(),
    deadline: z.date(),
    cutoff: z.date(),
    courseId: z.string(),
  })
  .omit({ id: true })
  .refine(
    (data) => {
      const now = new Date();
      return data.deadline > now;
    },
    {
      message: "The deadline must be in the future",
      path: ["deadline"],
    },
  )
  .refine((data) => data.deadline > data.availableAt, {
    message: "The deadline must be after the available date",
    path: ["deadline"],
  })
  .refine((data) => data.cutoff >= data.deadline, {
    message: "The cutoff must be on or after the deadline",
    path: ["cutoff"],
  });

export const updateDeliverableSchema = baseDeliverableSchema;
export const updateDeliverableParams = baseDeliverableSchema
  .extend({
    name: z.string().min(1, "Deliverable name is required."),
    weighting: z
      .number()
      .int()
      .refine((val: number) => {
        return val >= 0 && val <= 100;
      }, "Weighting must be an integer between 0 and 100."),
    availableAt: z.date(),
    deadline: z.date(),
    cutoff: z.date(),
    courseId: courseIdSchema.shape.id,
  })
  .refine(
    (data) => {
      const now = new Date();
      return data.deadline > now;
    },
    {
      message: "The deadline must be in the future",
      path: ["deadline"],
    },
  )
  .refine((data) => data.deadline > data.availableAt, {
    message: "The deadline must be after the available date",
    path: ["deadline"],
  })
  .refine((data) => data.cutoff >= data.deadline, {
    message: "The cutoff must be on or after the deadline",
    path: ["cutoff"],
  });

export const deleteDeliverableSchema = baseDeliverableSchema
  .pick({
    id: true,
    assignmentId: true,
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
