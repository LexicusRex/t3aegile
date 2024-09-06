"use server";

import "server-only";

// import { revalidatePath } from "next/cache";

// import { PERM_COURSE_MANAGE_CORE } from "@/lib/constants";

import {
  disableRolePermission,
  enableRolePermission,
} from "../api/crud/roles/mutations";
import { withTransaction } from "../api/crud/utils";
import {
  updateRolePermissionParams,
  type UpdateRolePermissionParams,
} from "../db/schema/rolePermissions";
import {
  adminProtectedAction,
  // permissionProtectedAction
} from "./safe-action";

export const updateRolePermissionsAction = adminProtectedAction(
  async (input: UpdateRolePermissionParams) => {
    const payload = updateRolePermissionParams.parse(input);

    await withTransaction(async (tx) => {
      const roleId = payload.roleId;
      for (const [permission, isEnabled] of Object.entries(
        payload.permissions,
      )) {
        isEnabled
          ? await enableRolePermission({ roleId, permission }, tx)
          : await disableRolePermission({ roleId, permission }, tx);
      }
    });
  },
);
