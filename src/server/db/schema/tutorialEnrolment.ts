import { courses, tutorials, users } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { timestamps } from "@/lib/utils";

import { ID_LENGTH } from "./config";
import { createTable } from "./util";

export const tutorialEnrolments = createTable(
  "tutorial_enrolment",
  {
    userId: varchar("user_id", { length: ID_LENGTH })
      .notNull()
      .references(() => users.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
    courseId: varchar("course_id", { length: ID_LENGTH })
      .notNull()
      .references(() => courses.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
    tutorialId: varchar("tutorial_id", { length: ID_LENGTH })
      .notNull()
      .references(() => tutorials.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
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
    pk: primaryKey({ columns: [t.userId, t.courseId, t.tutorialId] }),
  }),
);

const baseSchema = createSelectSchema(tutorialEnrolments).omit(timestamps);
export const insertTutorialEnrolmentSchema =
  createInsertSchema(tutorialEnrolments).omit(timestamps);

export const updateTutorialEnrolmentSchema =
  insertTutorialEnrolmentSchema.partial();

export type TutorialEnrolment = z.infer<typeof baseSchema>;
export type NewTutorialEnrolment = z.infer<
  typeof insertTutorialEnrolmentSchema
>;
export type PartialTutorialEnrolment = z.infer<
  typeof updateTutorialEnrolmentSchema
>;
