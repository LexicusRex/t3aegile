import { relations, sql } from "drizzle-orm";
import { timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import { ID_LENGTH } from "./config";
import { rolePermissions } from "./role";
import { createTable, generateId } from "./util";

export const permissions = createTable(
  "permission",
  {
    id: varchar("id", { length: ID_LENGTH })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId("per")),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
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
    slugIdx: uniqueIndex("slug_idx").on(t.slug),
  }),
);

export const permissionRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));
