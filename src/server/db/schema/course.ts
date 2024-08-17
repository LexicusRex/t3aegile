import { type getCourses } from "@/server/api/crud/courses/queries";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "@/lib/utils";

import { ID_LENGTH } from "./config";
import { courseEnrolments } from "./courseEnrolment";
import { createTable, generateId } from "./util";

export const courses = createTable(
  "course",
  {
    id: varchar("id", { length: ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId("crs")),
    code: varchar("code", { length: 255 }).notNull(),
    term: varchar("term", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    isActive: boolean("is_active").default(true),
    memberCount: integer("member_count").default(0),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({ uniqueCourseOffering: unique().on(t.code, t.term) }),
);

export const coursesRelations = relations(courses, ({ many }) => ({
  enrolments: many(courseEnrolments),
}));

// Schema for courses - used to validate API requests
const baseSchema = createSelectSchema(courses).omit({
  ...timestamps,
  memberCount: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  ...timestamps,
  memberCount: true,
});
export const insertCourseParams = baseSchema
  .extend({
    term: z.string({
      required_error: "Please select a term offering.",
    }),
    code: z
      .string()
      .length(8, { message: "Course code must be exactly 8 characters." })
      .refine((code) => /^[A-Za-z]{4}\d{4}$/.test(code), {
        message:
          "Course code must begin with 4 letters and end with 4 numbers.",
      }),
    name: z.string().min(1, { message: "Course name is required." }).max(120, {
      message: "Course name must not exceed 120 characters.",
    }),
    isActive: z.coerce.boolean().default(true),
    description: z.string().optional().default(""),
  })
  .omit({
    id: true,
  });

export const updateCourseSchema = baseSchema;
export const updateCourseParams = baseSchema.extend({
  term: z.string({
    required_error: "Please select a term offering.",
  }),
  code: z
    .string()
    .length(8, { message: "Course code must be exactly 8 characters." })
    .refine((code) => /^[A-Za-z]{4}\d{4}$/.test(code), {
      message: "Course code must begin with 4 letters and end with 4 numbers.",
    }),
  name: z.string().min(1, { message: "Course name is required." }).max(120, {
    message: "Course name must not exceed 120 characters.",
  }),
  isActive: z.coerce.boolean().default(true),
  description: z.string().optional(),
});
export const courseIdSchema = baseSchema.pick({ id: true });

// Types for courses - used to type API request params and within Components
export type Course = typeof courses.$inferSelect;
export type NewCourse = z.infer<typeof insertCourseSchema>;
export type NewCourseParams = z.infer<typeof insertCourseParams>;
export type UpdateCourseParams = z.infer<typeof updateCourseParams>;
export type CourseId = z.infer<typeof courseIdSchema>["id"];

// this type infers the return from getCourses() - meaning it will include any joins
export type CompleteCourse = Awaited<
  ReturnType<typeof getCourses>
>["courses"][number];
