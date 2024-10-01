import { sql } from "drizzle-orm";
import {
  integer,
  text,
  time,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "@/lib/utils";

import { ID_LENGTH } from "./config";
import { courses } from "./course";
import { createTable, generateId } from "./util";

/**
 * The schema for the `tutorial` table.
 *
 * @remarks
 * This table stores tutorials. Tutorials are used to group students together for a specific course.
 * Tutorials are associated with one and only one specific course.
 * Tutorials have a name, location and a weekly lesson time.
 * Tutorials must have a start and end time.
 *
 */
export const tutorials = createTable(
  "tutorial",
  {
    id: varchar("id", { length: ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId("tut")),
    courseId: varchar("course_id", { length: ID_LENGTH })
      .notNull()
      .references(() => courses.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
    name: text("name").notNull(),
    location: text("location"),
    dayOfWeek: integer("day_of_week").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),

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
  (t) => ({ uniqueTutorial: unique().on(t.courseId, t.name) }),
);

// Base schema for tutorials
const baseSchema = createSelectSchema(tutorials).omit(timestamps);

// Schema for inserting a new tutorial
export const insertTutorialSchema = createInsertSchema(tutorials).omit({
  ...timestamps,
  id: true,
});

export const insertTutorialParams = baseSchema
  .extend({
    courseId: z.string().length(ID_LENGTH, { message: "Invalid course ID." }),
    name: z.string().min(1, { message: "Tutorial name is required." }).max(10, {
      message: "Tutorial name must not exceed 10 characters.",
    }),
    location: z.string().optional(),
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
  })
  .omit({
    id: true,
  });

// Schema for updating an existing tutorial
export const updateTutorialSchema = baseSchema;
export const updateTutorialParams = baseSchema.extend({
  name: z.string().min(1, { message: "Tutorial name is required." }).max(10, {
    message: "Tutorial name must not exceed 10 characters.",
  }),
  location: z.string().optional(),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/),
});

// Schema for tutorial ID
export const tutorialIdSchema = baseSchema.pick({ id: true }).extend({
  id: z.string().regex(new RegExp(`^tut_[a-zA-Z0-9]{${ID_LENGTH - 4}}$`), {
    message: "Invalid tutorial ID format.",
  }),
});

export const tutorialCoreSchema = baseSchema
  .pick({ id: true, name: true })
  .extend({
    id: z.string().regex(new RegExp(`^tut_[a-zA-Z0-9]{${ID_LENGTH - 4}}$`), {
      message: "Invalid tutorial ID format.",
    }),
  });

// Types for tutorials - used to type API request params and within Components
export type Tutorial = typeof tutorials.$inferSelect;
export type NewTutorial = z.infer<typeof insertTutorialSchema>;
export type NewTutorialParams = z.infer<typeof insertTutorialParams>;
export type UpdateTutorialParams = z.infer<typeof updateTutorialParams>;
export type TutorialId = z.infer<typeof tutorialIdSchema>["id"];
export type TutorialCore = z.infer<typeof tutorialCoreSchema>;

// // This type infers the return from getTutorials() - meaning it will include any joins
// export type CompleteTutorial = Awaited<
//   ReturnType<typeof getTutorials>
// >["tutorials"][number];
