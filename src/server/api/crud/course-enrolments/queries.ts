import "server-only";

import { db } from "@/server/db/index";
import { courseEnrolments } from "@/server/db/schema";
import { users } from "@/server/db/schema/auth";
import {
  courseIdSchema,
  courses,
  type CourseId,
} from "@/server/db/schema/course";
import { roles } from "@/server/db/schema/role";
import { and, eq, isNull } from "drizzle-orm";

import type { CourseEnrollable, CourseParticipant } from "./types";

export const getCourses = async () => {
  const rows = await db.select().from(courses);
  const c = rows;
  return { courses: c };
};

export const getCourseEnrollable = async (courseId: CourseId) => {
  const { id } = courseIdSchema.parse({ id: courseId });
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
    })
    .from(users)
    .leftJoin(
      courseEnrolments,
      and(
        eq(courseEnrolments.userId, users.id),
        eq(courseEnrolments.courseId, id),
      ),
    )
    .where(isNull(courseEnrolments.courseId));

  const c: CourseEnrollable[] = rows;
  return { enrollable: c };
};

export const getCourseEnrolments = async (courseId: CourseId) => {
  const { id } = courseIdSchema.parse({ id: courseId });
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: roles.name,
    })
    .from(courseEnrolments)
    .where(eq(courseEnrolments.courseId, id))
    .innerJoin(users, eq(users.id, courseEnrolments.userId))
    .innerJoin(roles, eq(roles.id, courseEnrolments.roleId));

  const c: CourseParticipant[] = rows;
  return { participants: c };
};
