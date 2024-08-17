import { db } from "@/server/db/index";
import {
  insertRoleSchema,
  roles,
  type NewRoleParams,
} from "@/server/db/schema/role";
import {
  insertRolePermissionSchema,
  rolePermissions,
  type NewRolePermission,
} from "@/server/db/schema/rolePermissions";
import type { DrizzleTransaction } from "@/server/db/types";
import { and, eq } from "drizzle-orm";

export const createRole = async (role: NewRoleParams) => {
  const newRole = insertRoleSchema.parse(role);
  try {
    const [r] = await db.insert(roles).values(newRole).returning();
    return { ...r };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message, message };
  }
};

export const enableRolePermission = async (
  rolePermission: NewRolePermission,
) => {
  const enabledPermission = insertRolePermissionSchema.parse(rolePermission);
  try {
    const [rp] = await db
      .insert(rolePermissions)
      .values(enabledPermission)
      .returning();
    return { rolePermission: rp };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message, message };
  }
};

export const disableRolePermission = async (
  rolePermission: NewRolePermission,
) => {
  const disabledPermission = insertRolePermissionSchema.parse(rolePermission);
  try {
    await db
      .delete(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, disabledPermission.roleId),
          eq(rolePermissions.permission, disabledPermission.permission),
        ),
      )
      .returning();
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message, message };
  }
};
