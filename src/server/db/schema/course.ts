// import { relations, sql } from "drizzle-orm";
// import {
//   boolean,
//   index,
//   integer,
//   primaryKey,
//   text,
//   timestamp,
//   varchar,
// } from "drizzle-orm/pg-core";
// import { createTable } from "./util";
// import { nanoid } from "@/lib/utils";
// import { users } from "./auth";

// export const courses = createTable("course", {
//   id: varchar("id", { length: 191 })
//     .notNull()
//     .primaryKey()
//     .$defaultFn(() => nanoid()),
//   name: varchar("name", { length: 255 }).notNull(),
//   code: varchar("code", { length: 255 }).notNull(),
//   termOffering: varchar("term_offering", { length: 256 }).notNull(),
//   description: text("description"),
//   isActive: boolean("is_active").default(true),
//   createdAt: timestamp("created_at", {
//     mode: "date",
//     withTimezone: true,
//   }).default(sql`CURRENT_TIMESTAMP`),
//   updatedAt: timestamp("updated_at", {
//     mode: "date",
//     withTimezone: true,
//   }).default(sql`CURRENT_TIMESTAMP`),
// }, (t) => ({}))