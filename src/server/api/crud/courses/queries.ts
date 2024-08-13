import { db } from "@/server/db/index";
import { courseEnrolments } from "@/server/db/schema";
import { userIdSchema, type UserId } from "@/server/db/schema/auth";
import {
  courseIdSchema,
  courses,
  type CourseId,
} from "@/server/db/schema/course";
import { and, eq, getTableColumns } from "drizzle-orm";

export const getCourses = async () => {
  const rows = await db.select().from(courses);
  const c = rows;
  return { courses: c };
};

export const getCourseById = async (id: CourseId) => {
  const { id: courseId } = courseIdSchema.parse({ id });
  const [row] = await db.select().from(courses).where(eq(courses.id, courseId));
  if (row === undefined) return {};
  const c = row;
  return { course: c };
};

export const getCoursesByEnrolment = async (id: string) => {
  const { id: userId } = userIdSchema.parse({ id });
  const rows = await db
    .select({ ...getTableColumns(courses) })
    .from(courses)
    .innerJoin(courseEnrolments, eq(courseEnrolments.courseId, courses.id))
    .where(eq(courseEnrolments.userId, userId));
  const c = rows;
  return { courses: c };
};

export const checkCourseEnrolment = async (
  userId: string,
  courseId: string,
) => {
  // const { id: _userId } = userIdSchema.parse({ userId });
  // const { id: _courseId } = courseIdSchema.parse({ courseId });

  const prepared = db
    .select()
    .from(courseEnrolments)
    .where(
      and(
        eq(courseEnrolments.userId, userId),
        eq(courseEnrolments.courseId, courseId),
      ),
    );

  const result = await prepared.execute();
  return result.length > 0;
};
