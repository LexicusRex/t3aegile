import type db from "@/server/db";

import { permissions } from "../schema";
import type { PermissionSlug } from "../schema/permission";
import permissionsData from "./data/permissions.json";

export default async function seed(db: db) {
  const formattedPermissionsData = permissionsData.map((data) => ({
    slug: data.slug as PermissionSlug,
  }));
  await db.insert(permissions).values(formattedPermissionsData);
}
