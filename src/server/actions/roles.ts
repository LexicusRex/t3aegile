"use server";

import "server-only";

import { revalidatePath } from "next/cache";

// import { revalidatePath } from "next/cache";

// import { PERM_COURSE_MANAGE_CORE } from "@/lib/constants";

import {
  createRole,
  disableRolePermission,
  enableRolePermission,
  updateRole,
} from "../api/crud/roles/mutations";
import { withTransaction } from "../api/crud/utils";
import type { PermissionSlug } from "../db/schema/permission";
import {
  insertRoleParams,
  updateRoleAndPermissionsParams,
  type NewRoleParams,
  type UpdateRoleAndPermissionsParams,
} from "../db/schema/role";
import {
  adminProtectedAction,
  // permissionProtectedAction
} from "./safe-action";

export const createRoleAction = adminProtectedAction(
  async (input: NewRoleParams) => {
    const payload = insertRoleParams.parse(input);
    await withTransaction(async (tx) => {
      await createRole(payload, tx);
      revalidatePath(`/courses/${payload.courseId}/settings/roles`);
    });
  },
);

export const updateRolePermissionsAction = adminProtectedAction(
  async (input: UpdateRoleAndPermissionsParams) => {
    const payload = updateRoleAndPermissionsParams.parse(input);

    await withTransaction(async (tx) => {
      const roleId = payload.id;
      await updateRole(payload, tx);
      for (const [permission, isEnabled] of Object.entries(
        payload.permissions,
      )) {
        isEnabled
          ? await enableRolePermission(
              { roleId, permission: permission as PermissionSlug },
              tx,
            )
          : await disableRolePermission(
              { roleId, permission: permission as PermissionSlug },
              tx,
            );
      }
      revalidatePath(`/courses/${payload.courseId}/settings/roles`);
    });
  },
);
