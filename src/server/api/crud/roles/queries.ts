import db from "@/server/db";
import { rolePermissions, roles } from "@/server/db/schema";
import { courseIdSchema, type CourseId } from "@/server/db/schema/course";
import type { PermissionSlug } from "@/server/db/schema/permission";
import { roleIdSchema, type RoleId } from "@/server/db/schema/role";
import type { DrizzleTransaction } from "@/server/db/types";
import { and, asc, eq } from "drizzle-orm";

export const getRoleById = async (roleId: RoleId) => {
  const { id } = roleIdSchema.parse({ id: roleId });
  const [r] = await db
    .select({
      id: roles.id,
      name: roles.name,
      isCourseDefault: roles.isCourseDefault,
    })
    .from(roles)
    .where(eq(roles.id, id))
    .limit(1);

  return { role: r };
};

export const getDefaultCourseRole = async (
  courseId: CourseId,
  tx: DrizzleTransaction,
) => {
  const { id } = courseIdSchema.parse({ id: courseId });
  const [defaultRole] = await tx
    .select({ id: roles.id })
    .from(roles)
    .where(and(eq(roles.courseId, id), eq(roles.isCourseDefault, true)))
    .limit(1);

  return !defaultRole ? null : defaultRole.id;
};

export const getCourseRoles = async (
  courseId: CourseId,
  tx?: DrizzleTransaction,
) => {
  const { id } = courseIdSchema.parse({ id: courseId });
  const courseRoles = await (tx ?? db)
    .select({ id: roles.id, name: roles.name })
    .from(roles)
    .where(eq(roles.courseId, id))
    .orderBy(asc(roles.createdAt));

  return { roles: courseRoles };
};

type RolePermissionsResult = {
  permissions: Record<PermissionSlug, boolean>;
};

export const getRolePermissions = async (
  roleId: RoleId,
): Promise<RolePermissionsResult> => {
  const { id } = roleIdSchema.parse({ id: roleId });
  const permissions = await db
    .select({ permission: rolePermissions.permission })
    .from(rolePermissions)
    .where(eq(rolePermissions.roleId, id));

  return {
    permissions: permissions.reduce(
      (acc, perm) => ({ ...acc, [perm.permission]: true }),
      {} as Record<PermissionSlug, boolean>,
    ),
  };
};
