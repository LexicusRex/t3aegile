import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "@/lib/utils";

import { ID_LENGTH } from "./config";
import { courses } from "./course";
import { rolePermissions } from "./rolePermissions";
import { createTable, generateId } from "./util";

export const roles = createTable(
  "role",
  {
    id: varchar("id", { length: ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId("rol")),
    courseId: varchar("course_id", { length: ID_LENGTH })
      .notNull()
      .references(() => courses.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
    isCourseDefault: boolean("is_course_default").default(false),
    name: varchar("name", { length: 255 }).notNull(),
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
    uniqueCourseRole: unique("unq_course_role").on(t.courseId, t.name),
  }),
);

export const roleRelations = relations(roles, ({ many }) => ({
  permissions: many(rolePermissions),
}));

// Base schema for roles - used to validate API requests
const baseRoleSchema = createSelectSchema(roles).omit(timestamps);

// Schema for inserting a new role
export const insertRoleSchema = createInsertSchema(roles).omit(timestamps);
export const insertRoleParams = baseRoleSchema
  .extend({
    name: z.string().min(1, { message: "Role name is required." }).max(255, {
      message: "Role name must not exceed 255 characters.",
    }),
  })
  .omit({
    id: true,
  });

// Schema for updating a role
export const updateRoleSchema = baseRoleSchema;
export const updateRoleParams = baseRoleSchema.extend({
  name: z.string().min(1, { message: "Role name is required." }).max(255, {
    message: "Role name must not exceed 255 characters.",
  }),
});
export const roleIdSchema = baseRoleSchema.pick({ id: true });

// Types for roles - used to type API request params and within Components
export type Role = typeof roles.$inferSelect;
export type NewRole = z.infer<typeof insertRoleSchema>;
export type NewRoleParams = z.infer<typeof insertRoleParams>;
export type UpdateRoleParams = z.infer<typeof updateRoleParams>;
export type RoleId = z.infer<typeof roleIdSchema>["id"];

// db.query.role.findMany({
//   columns: {
//     id: true,
//     name: true,
//     displayName: true,
//   },
//   with: {
//     roleToPermissions: {
//       columns: {
//         roleId: false,
//       },
//       with: {
//         permission: {
//           columns: {
//             slug: true,
//           },
//         },
//       },
//     },
//   },
// });

// db.select()
//   .from(courseEnrolment)
//   .where(
//     and(
//       eq(courseEnrolment.userId, "<USER_ID>"),
//       eq(courseEnrolment.courseId, "<COURSE_ID>"),
//     ),
//   )
//   .leftJoin(
//     roleToPermission,
//     eq(courseEnrolment.roleId, roleToPermission.roleId),
//   )
//   .innerJoin(
//     permission,
//     and(
//       eq(roleToPermission.permissionId, permission.id),
//       eq(permission.slug, "course:view_external"),
//     ),
//   );
