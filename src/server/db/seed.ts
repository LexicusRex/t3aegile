import { conn, db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { getTableName, sql, type Table } from "drizzle-orm";

import { env } from "@/env";

import * as seeds from "./seeds";

// Load environment variables from .env file

if (!env.DB_SEEDING) {
  throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
  return db.execute(
    sql.raw(`TRUNCATE TABLE "${getTableName(table)}" RESTART IDENTITY CASCADE`),
  );
}

for (const table of [
  schema.verificationTokens,
  schema.sessions,
  schema.accounts,
  schema.users,
  schema.courses,
  schema.courseEnrolments,
  schema.permissions,
  schema.rolePermissions,
  schema.roles,
]) {
  // await db.delete(table); // clear tables without truncating / resetting ids
  await resetTable(db, table as Table);
}

await seeds.course(db);
await seeds.permission(db);
await seeds.role(db);
await seeds.rolePermission(db);
// await seeds.category(db);
// await seeds.statusCatalog(db);
// await seeds.state(db);
// await seeds.city(db);
// await seeds.restaurant(db);
// await seeds.user(db);
// await seeds.order(db);

await conn.end();
