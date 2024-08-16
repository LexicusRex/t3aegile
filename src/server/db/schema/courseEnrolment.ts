import {
  // eq,
  relations,
  sql,
} from "drizzle-orm";
import {
  // pgView,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { timestamps } from "@/lib/utils";

import { users } from "./auth";
import { ID_LENGTH } from "./config";
import { courses } from "./course";
import { roles } from "./role";
// import { permissions, rolePermissions, roles } from "./roles";
import { createTable } from "./util";

export const courseEnrolments = createTable(
  "course_enrolment",
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
    roleId: varchar("role_id", { length: ID_LENGTH })
      .notNull()
      .references(() => roles.id, {
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
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.courseId] }),
  }),
);

export const courseEnrolmentRelations = relations(
  courseEnrolments,
  ({ one }) => ({
    user: one(users, {
      fields: [courseEnrolments.userId],
      references: [users.id],
    }),
    course: one(courses, {
      fields: [courseEnrolments.courseId],
      references: [courses.id],
    }),
  }),
);

// Schema for courses - used to validate API requests
const baseSchema = createSelectSchema(courseEnrolments).omit(timestamps);

export const insertCourseEnrolmentSchema =
  createInsertSchema(courseEnrolments).omit(timestamps);
export const insertCourseEnrolmentParams = baseSchema;

export const updateCourseEnrolmentSchema = baseSchema;
export const updateCourseEnrolmentParams = baseSchema;

// Types for courses - used to type API request params and within Components
export type CourseEnrolment = typeof courseEnrolments.$inferSelect;
export type NewCourseEnrolment = z.infer<typeof insertCourseEnrolmentSchema>;
export type NewCourseEnrolmentParams = z.infer<
  typeof insertCourseEnrolmentParams
>;
export type UpdateCourseEnrolmentParams = z.infer<
  typeof updateCourseEnrolmentParams
>;
