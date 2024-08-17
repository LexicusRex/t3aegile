// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

// import { env } from "@/env";

// import * as schema from "./schema";

// /**
//  * Cache the database connection in development. This avoids creating a new connection on every HMR
//  * update.
//  */
// const globalForDb = globalThis as unknown as {
//   conn: postgres.Sql | undefined;
// };

// export const conn =
//   globalForDb.conn ??
//   postgres(env.POSTGRES_URL, {
//     max: (process.env.DB_MIGRATING ?? process.env.DB_SEEDING) ? 1 : undefined,
//   });
// if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// export const db = drizzle(conn, { schema });

// export type db = typeof db;

// export default db;

// -----------------------------------------------------------------------------

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

export const db = drizzle(sql, { schema });

export type db = typeof db;

export default db;
