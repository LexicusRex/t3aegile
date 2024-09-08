import db from "@/server/db";
import {
  assignmentIdSchema,
  assignments,
  type AssignmentId,
} from "@/server/db/schema/assignment";
import type { CourseId } from "@/server/db/schema/course";
import { and, eq, lt } from "drizzle-orm";

export const getAssignmentById = async (assignmentId: AssignmentId) => {
  const { id } = assignmentIdSchema.parse({ id: assignmentId });
  const [a] = await db
    .select()
    .from(assignments)
    .where(eq(assignments.id, id))
    .limit(1);

  return { assignment: a };
};

export const getAssignmentsByCourse = async (courseId: CourseId) => {
  // get all active assignments where the assignment availableAt is past the current time
  const cas = await db
    .select()
    .from(assignments)
    .where(
      and(
        eq(assignments.courseId, courseId),
        // lt(assignments.availableAt, new Date()),
      ),
    );
  console.log("🚀 ~ getAssignmentsByCourse ~ cas:", cas);
  return { assignments: cas };
};
