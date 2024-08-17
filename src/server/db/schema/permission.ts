import { relations, sql } from "drizzle-orm";
import { timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { rolePermissions } from "./rolePermissions";
import { createTable } from "./util";

export const permissions = createTable("permission", {
  // id: varchar("id", { length: ID_LENGTH })
  //   .notNull()
  //   .primaryKey()
  //   .$defaultFn(() => generateId("per")),
  slug: varchar("slug", { length: 255 }).primaryKey().notNull(),
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
  slug: z
    .string()
    .min(1, { message: "Permission slug is required." })
    .max(255, {
      message: "Permission slug must not exceed 255 characters.",
    }),
});

// Schema for validating a permission slug
export const permissionSlugSchema = basePermissionSchema.pick({ slug: true });

// Types for permissions - used to type API request params and within Components
export type Permission = typeof permissions.$inferSelect;
export type NewPermission = z.infer<typeof insertPermissionSchema>;
export type NewPermissionParams = z.infer<typeof insertPermissionParams>;
export type UpdatePermissionParams = z.infer<typeof updatePermissionParams>;
export type PermissionSlug = z.infer<typeof permissionSlugSchema>["slug"];
