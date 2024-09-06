import { relations, sql } from "drizzle-orm";
import { pgEnum, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import * as constants from "@/lib/constants";

import { rolePermissions } from "./rolePermissions";
import { createTable } from "./util";

export const permissionsList: [string, ...string[]] = [
  constants.PERM_COURSE_MANAGE_ENROLMENTS,
  constants.PERM_COURSE_MANAGE_CORE,
  constants.PERM_ROLE_MANAGE,
  constants.PERM_TUTORIAL_MANAGE_CORE,
  constants.PERM_TUTORIAL_MANAGE_ENROLMENTS,
  constants.PERM_TUTORIAL_VIEW,
  constants.PERM_GROUP_MANAGE_CORE,
  constants.PERM_GROUP_MANAGE_ENROLMENTS,
  constants.PERM_GROUP_MANAGE_SELF_ENROLMENT,
  constants.PERM_GROUP_VIEW,
  constants.PERM_ASSIGNMENT_MANAGE_CORE,
  constants.PERM_SUBMISSION_SUBMIT,
  constants.PERM_SUBMISSION_VIEW,
  constants.PERM_SUBMISSION_RESUBMIT,
];

export const permissionEnum = pgEnum("slug", permissionsList);

export const permissions = createTable("permission", {
  // id: varchar("id", { length: ID_LENGTH })
  //   .notNull()
  //   .primaryKey()
  //   .$defaultFn(() => generateId("per")),
  slug: permissionEnum("slug").primaryKey().notNull(),
  // slug: varchar("slug", { length: 255 }).primaryKey().notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const permissionRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));


export const PermissionEnum = z.enum(permissionsList);

// Base schema for permissions - used to validate API requests
const basePermissionSchema = createSelectSchema(permissions);

// Schema for inserting a new permission
export const insertPermissionSchema = createInsertSchema(permissions);
export const insertPermissionParams = basePermissionSchema.extend({
  slug: z
    .string()
    .min(1, { message: "Permission slug is required." })
    .max(255, {
      message: "Permission slug must not exceed 255 characters.",
    }),
});

// Schema for updating a permission
export const updatePermissionSchema = basePermissionSchema;
export const updatePermissionParams = basePermissionSchema.extend({
  roleId: z.string().min(1, { message: "Role ID is required." }),
  permissions: z.record(z.boolean()),
});

// Schema for validating a permission slug
export const permissionSlugSchema = basePermissionSchema.pick({ slug: true });

// Types for permissions - used to type API request params and within Components
export type Permission = typeof permissions.$inferSelect;
export type NewPermission = z.infer<typeof insertPermissionSchema>;
export type NewPermissionParams = z.infer<typeof insertPermissionParams>;
export type UpdatePermissionParams = z.infer<typeof updatePermissionParams>;
export type PermissionSlug = z.infer<typeof permissionSlugSchema>["slug"];
