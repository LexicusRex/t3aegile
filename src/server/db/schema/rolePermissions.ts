import { relations, sql } from "drizzle-orm";
import { index, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { timestamps } from "@/lib/utils";

import { ID_LENGTH } from "./config";
import { permissions } from "./permission";
import { roles } from "./role";
import { createTable, generateId } from "./util";

export const rolePermissions = createTable(
  "role_to_permission",
  {
    roleId: varchar("role_id", { length: ID_LENGTH })
      .notNull()
      .references(() => roles.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
    permission: varchar("permission_id", { length: 255 })
      .notNull()
      .references(() => permissions.slug, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permission] }),
  }),
);

export const roleToPermissionRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permission],
      references: [permissions.slug],
    }),
  }),
);

// Base schema for rolePermissions - used to validate API requests
const baseRolePermissionSchema = createSelectSchema(rolePermissions);

// Schema for inserting a new role-permission relationship
export const insertRolePermissionSchema = createInsertSchema(rolePermissions);
export const insertRolePermissionParams = baseRolePermissionSchema.extend({
  roleId: z
    .string()
    .min(1, { message: "Role ID is required." })
    .length(ID_LENGTH),
  permission: z
    .string()
    .min(1, { message: "Permission slug is required." })
    .length(255),
});

// Schema for updating a role-permission relationship (if necessary)
export const updateRolePermissionSchema = baseRolePermissionSchema;
export const updateRolePermissionParams = baseRolePermissionSchema.extend({
  roleId: z
    .string()
    .min(1, { message: "Role ID is required." })
    .length(ID_LENGTH),
  permissionId: z
    .string()
    .min(1, { message: "Permission slug is required." })
    .length(255),
});

// Types for rolePermissions - used to type API request params and within Components
export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = z.infer<typeof insertRolePermissionSchema>;
export type NewRolePermissionParams = z.infer<
  typeof insertRolePermissionParams
>;
export type UpdateRolePermissionParams = z.infer<
  typeof updateRolePermissionParams
>;
