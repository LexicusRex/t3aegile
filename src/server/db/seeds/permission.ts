import type db from "@/server/db";

import { permissions } from "../schema";
import permissionsData from "./data/permissions.json";

export default async function seed(db: db) {
  await db.insert(permissions).values(permissionsData);
}
