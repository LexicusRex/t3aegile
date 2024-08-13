import { db } from "@/server/db/index";
import {
  courseIdSchema,
  courses,
  insertCourseSchema,
  updateCourseSchema,
  type CourseId,
  type NewCourse,
  type NewCourseParams,
  type UpdateCourseParams,
} from "@/server/db/schema/course";
import { eq } from "drizzle-orm";

import { createRole, enableRolePermission } from "../roles/mutations";
import { defaultRoles } from "./default-roles";

export const createCourse = async (course: NewCourseParams) => {
  const newCourse = insertCourseSchema.parse(course);
  try {
    const [c] = await db.insert(courses).values(newCourse).returning();
    await initDefaultRoles(course);
    return { course: c };
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

export const initDefaultRoles = async (course: NewCourse) => {
  const newCourse = insertCourseSchema.parse(course);
  for (const role of defaultRoles) {
    const newRole = await createRole({
      name: `${newCourse.term}_${newCourse.code}_${role.displayName}`,
      displayName: role.displayName,
    });

    for (const permission of role.permissions) {
      await enableRolePermission({
        roleId: newRole.id ?? "",
        permission: permission,
      });
    }
  }
};
