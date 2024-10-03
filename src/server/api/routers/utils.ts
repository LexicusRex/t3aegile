import { courseEnrolments, rolePermissions } from "@/server/db/schema";
import type { PermissionSlug } from "@/server/db/schema/permission";
import type { DrizzleTransaction } from "@/server/db/types";
import { and, eq } from "drizzle-orm";

export async function checkCourseRolePermission(
  tx: DrizzleTransaction,
  courseId: string,
  userId: string,
  permission: PermissionSlug,
): Promise<boolean> {
  const courseRolePermission = await tx
    .select()
    .from(courseEnrolments)
    .innerJoin(
      rolePermissions,
      and(
        eq(rolePermissions.roleId, courseEnrolments.roleId),
        eq(courseEnrolments.courseId, courseId),
        eq(courseEnrolments.userId, userId),
      ),
    )
    .where(eq(rolePermissions.permission, permission));
  return courseRolePermission.length > 0;
}
