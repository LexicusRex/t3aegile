import type db from "@/server/db";

// import { eq } from "drizzle-orm";

// import { permissions, rolePermissions, roles } from "../schema";
// import type { PermissionSlug } from "../schema/permission";
// import rolePermissionsData from "./data/rolePermissions.json";

export default async function seed(db: db) {
  // for (const rolePermission of rolePermissionsData) {
  //   // Find the role ID
  //   const [foundRole] = await db
  //     .select()
  //     .from(roles)
  //     .where(eq(roles.name, rolePermission.role));
  //   if (!foundRole) {
  //     console.error(`Role not found: ${rolePermission.role}`);
  //     continue;
  //   }
  //   // Find the permission IDs
  //   const permissionIds = [];
  //   for (const perm of rolePermission.permissions) {
  //     const [foundPermission] = await db
  //       .select()
  //       .from(permissions)
  //       .where(eq(permissions.slug, perm));
  //     if (!foundPermission) {
  //       console.error(`Permission not found: ${perm}`);
  //       continue;
  //     }
  //     permissionIds.push(foundPermission.slug);
  //   }
  //   // Insert role-permission relationships into the database
  //   const rolePermissionsToInsert = permissionIds.map((permission) => ({
  //     roleId: foundRole.id,
  //     permission,
  //   }));
  //   await db.insert(rolePermissions).values(rolePermissionsToInsert);
  // }
}
