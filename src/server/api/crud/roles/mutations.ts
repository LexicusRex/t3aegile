import {
  insertRoleSchema,
  roles,
  updateRoleSchema,
  type NewRoleParams,
  type RoleId,
  type UpdateRoleParams,
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

export const updateRole = async (
  role: UpdateRoleParams,
  tx: DrizzleTransaction,
) => {
  const parsedRole = updateRoleSchema.parse(role);
  try {
    if (parsedRole.isCourseDefault) {
      // set all other roles to not be course default
      await tx
        .update(roles)
        .set({ isCourseDefault: false })
        .where(
          and(
            eq(roles.courseId, parsedRole.courseId),
            eq(roles.isCourseDefault, true),
          ),
        );
    }
    await tx.update(roles).set(parsedRole).where(eq(roles.id, role.id));
  } catch (err) {
    handleError(err);
  }
};

export const deleteRole = async (id: RoleId, tx: DrizzleTransaction) => {
  try {
    // check if role is course default
    const [role] = await tx
      .select()
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);
    if (role?.isCourseDefault) {
      throw new Error("Cannot delete default coruse role");
    }
    await tx.delete(roles).where(eq(roles.id, id));
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
  tx: DrizzleTransaction,
) => {
  const disabledPermission = insertRolePermissionSchema.parse(rolePermission);
  try {
    await tx
      .delete(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, disabledPermission.roleId),
          eq(rolePermissions.permission, disabledPermission.permission),
        ),
      );
  } catch (err) {
    handleError(err);
  }
};
