import type db from "@/server/db";

import { roles } from "../schema";
import rolesData from "./data/roles.json";

export default async function seed(db: db) {
  await db.insert(roles).values(rolesData);

  // // Insert permissions into the database
  // const insertedPermissions = await db
  //   .insert(permissions)
  //   .values(permissionsData)
  //   .returning();

  // // Assign permissions to roles
  // const rolePermissionsData = [];

  // for (const role of insertedRoles) {
  //   for (const permission of insertedPermissions) {
  //     // Example logic: Assign all permissions to all roles
  //     rolePermissionsData.push({
  //       roleId: role.id,
  //       permission: permission.slug,
  //     });
  //   }
  // }

  // // Insert role-permission relationships into the database
  // await db.insert(rolePermissions).values(rolePermissionsData);
}
