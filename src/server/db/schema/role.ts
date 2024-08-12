import { relations, sql } from "drizzle-orm";
import { index, primaryKey, timestamp, varchar } from "drizzle-orm/pg-core";

import { ID_LENGTH } from "./config";
import { permissions } from "./permission";
import { createTable, generateId } from "./util";

export const roles = createTable(
  "role",
  {
    id: varchar("id", { length: ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId("rol")),
    name: varchar("name", { length: 255 }).notNull().unique(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
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
    roleNameIdx: index("role_name_idx").on(t.name),
  }),
);

export const roleRelations = relations(roles, ({ many }) => ({
  permissions: many(rolePermissions),
}));

export const rolePermissions = createTable(
  "role_to_permission",
  {
    roleId: varchar("role_id", { length: ID_LENGTH })
      .notNull()
      .references(() => roles.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
    permissionId: varchar("permission_id", { length: ID_LENGTH })
      .notNull()
      .references(() => permissions.id, {
        onUpdate: "no action",
        onDelete: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
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
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

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
