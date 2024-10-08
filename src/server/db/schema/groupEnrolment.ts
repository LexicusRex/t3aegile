import { assignments, groups, users } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { primaryKey, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { timestamps } from "@/lib/utils";

import { ID_LENGTH } from "./config";
import { createTable } from "./util";

export const groupEnrolments = createTable(
  "group_enrolment",
  {
    assignmentId: varchar("assignment_id", { length: ID_LENGTH })
      .notNull()
      .references(() => assignments.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
    userId: varchar("user_id", { length: ID_LENGTH })
      .notNull()
      .references(() => users.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
    groupId: varchar("group_id", { length: ID_LENGTH })
      .notNull()
      .references(() => groups.id, {
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
    pk: primaryKey({ columns: [t.assignmentId, t.groupId, t.userId] }),
    uniqueAssignmentGroupEnrolment: unique().on(t.assignmentId, t.userId),
  }),
);

const baseSchema = createSelectSchema(groupEnrolments).omit(timestamps);
export const insertGroupEnrolmentSchema =
  createInsertSchema(groupEnrolments).omit(timestamps);

export const updateGroupEnrolmentSchema = insertGroupEnrolmentSchema.partial();

export type GroupEnrolment = z.infer<typeof baseSchema>;
export type NewGroupEnrolment = z.infer<typeof insertGroupEnrolmentSchema>;
export type ModifiedGroupEnrolment = z.infer<typeof updateGroupEnrolmentSchema>;
