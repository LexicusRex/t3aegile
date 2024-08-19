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

import { handleError } from "../utils";

export const createRole = async (
  role: NewRoleParams,
  tx: DrizzleTransaction,
) => {
  const newRole = insertRoleSchema.parse(role);
  try {
    const [r] = await tx.insert(roles).values(newRole).returning();
    return { ...r };
  } catch (err) {
    handleError(err);
  }
};

export const enableRolePermission = async (
  rolePermission: NewRolePermission,
  tx: DrizzleTransaction,
) => {
  const enabledPermission = insertRolePermissionSchema.parse(rolePermission);
  try {
    const [rp] = await tx
      .insert(rolePermissions)
      .values(enabledPermission)
      .returning();
    return { rolePermission: rp };
  } catch (err) {
    handleError(err);
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
    handleError(err);
  }
};
