import { db } from "@/server/db/index";
import { courseEnrolments } from "@/server/db/schema";
import type { UserId } from "@/server/db/schema/auth";
import {
  courseIdSchema,
  courses,
  type CourseId,
} from "@/server/db/schema/course";
import { eq } from "drizzle-orm";

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

export const getCoursesByEnrolment = async (id: UserId) => {
  const { id: userId } = courseIdSchema.parse({ id });
  const rows = await db
    .select()
    .from(courses)
    .innerJoin(courseEnrolments, eq(courseEnrolments.courseId, courses.id))
    .where(eq(courseEnrolments.userId, userId));
  const c = rows;
  return { courses: c };
};
