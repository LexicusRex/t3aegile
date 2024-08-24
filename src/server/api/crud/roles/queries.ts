import { roles } from "@/server/db/schema";
import { courseIdSchema, type CourseId } from "@/server/db/schema/course";
import type { DrizzleTransaction } from "@/server/db/types";
import { and, eq } from "drizzle-orm";

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
