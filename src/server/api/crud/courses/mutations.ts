import { db } from "@/server/db/index";
import { courseEnrolments } from "@/server/db/schema";
import {
  courseIdSchema,
  courses,
  insertCourseSchema,
  updateCourseSchema,
  type Course,
  type CourseId,
  type NewCourseParams,
  type UpdateCourseParams,
} from "@/server/db/schema/course";
import {
  insertCourseEnrolmentSchema,
  type CourseEnrolment,
} from "@/server/db/schema/courseEnrolment";
import { and, eq, sql } from "drizzle-orm";

import { createRole, enableRolePermission } from "../roles/mutations";
import { defaultRoles } from "./default-roles";

export const createCourse = async (course: NewCourseParams) => {
  const newCourse = insertCourseSchema.parse(course);
  try {
    const [crs] = await db.insert(courses).values(newCourse).returning();
    await initDefaultRoles(crs!);
    return { course: crs };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateCourse = async (
  id: CourseId,
  course: UpdateCourseParams,
) => {
  const { id: courseId } = courseIdSchema.parse({ id });
  const newCourse = updateCourseSchema.parse(course);
  try {
    const [c] = await db
      .update(courses)
      .set({ ...newCourse, updatedAt: new Date() })
      .where(eq(courses.id, courseId))
      .returning();
    return { course: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteCourse = async (id: CourseId) => {
  const { id: courseId } = courseIdSchema.parse({ id });
  try {
    const [c] = await db
      .delete(courses)
      .where(eq(courses.id, courseId))
      .returning();
    return { course: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

const initDefaultRoles = async (course: Course) => {
  let lastRoleId: string | undefined;
  for (const role of defaultRoles) {
    const newRole = await createRole({
      name: `${course.term}_${course.code}_${role.displayName}`,
      displayName: role.displayName,
    });

    lastRoleId = newRole.id;

    for (const permission of role.permissions) {
      await enableRolePermission({
        roleId: newRole.id ?? "",
        permission: permission,
      });
    }
  }
  // TODO - set the final role as the default role for the course
  if (course.id && lastRoleId) {
    await db
      .update(courses)
      .set({ defaultRoleId: lastRoleId })
      .where(eq(courses.id, course.id));
  } else {
    throw new Error("Course ID is undefined. Cannot set the default role.");
  }
};

export const enrolUser = async (courseEnrolment: CourseEnrolment) => {
  const { courseId, userId } =
    insertCourseEnrolmentSchema.parse(courseEnrolment);

  const res = await db
    .select({ defaultRoleId: courses.defaultRoleId })
    .from(courses)
    .where(eq(courses.id, courseId));

  if (!res[0]?.defaultRoleId) {
    throw new Error("Course has no default role");
  }

  await db.insert(courseEnrolments).values({
    courseId,
    userId,
    roleId: res[0]?.defaultRoleId,
  });

  await db
    .update(courses)
    .set({ memberCount: sql`${courses.memberCount} + 1` })
    .where(eq(courses.id, courseId));
};

export const unenrolUser = async (courseEnrolment: CourseEnrolment) => {
  const { courseId, userId } =
    insertCourseEnrolmentSchema.parse(courseEnrolment);
  await db
    .delete(courseEnrolments)
    .where(
      and(
        eq(courseEnrolments.courseId, courseId),
        eq(courseEnrolments.userId, userId),
      ),
    );

  await db
    .update(courses)
    .set({ memberCount: sql`${courses.memberCount} - 1` })
    .where(eq(courses.id, courseId));
};
