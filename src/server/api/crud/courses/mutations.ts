import "server-only";

import { db } from "@/server/db/index";
import { courseEnrolments, roles } from "@/server/db/schema";
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
import type { DrizzleTransaction } from "@/server/db/types";
import { and, eq, sql } from "drizzle-orm";

import { createRole, enableRolePermission } from "../roles/mutations";
import { defaultRoles } from "./default-roles";

// export const createCourse = async (course: NewCourseParams) => {
//   const newCourse = insertCourseSchema.parse(course);
//   try {
//     return await db.transaction(async (tx) => {
//       // Insert the course
//       const [crs] = await tx.insert(courses).values(newCourse).returning();

//       // Attempt to initialize default roles
//       try {
//         await initDefaultRoles(crs!, tx);
//       } catch (err) {
//         console.error(
//           "Failed to initialize roles, rolling back course creation.",
//         );
//         throw err; // Escalate the error to trigger a rollback of the course
//       }

//       return { course: crs };
//     });
//   } catch (err) {
//     const message = (err as Error).message ?? "Error, please try again";
//     console.error(message);
//     throw { error: message };
//   }
//   // try {
//   //   const [crs] = await db.insert(courses).values(newCourse).returning();
//   //   await initDefaultRoles(crs!);
//   //   return { course: crs };
//   // } catch (err) {
//   //   const message = (err as Error).message ?? "Error, please try again";
//   //   console.error(message);
//   //   throw { error: message };
//   // }
// };

export const createCourse = async (
  course: NewCourseParams,
  tx: DrizzleTransaction,
) => {
  const newCourse = insertCourseSchema.parse(course);
  try {
    const [crs] = await tx.insert(courses).values(newCourse).returning();
    await initDefaultRoles(crs!, tx);
    // return { course: crs };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message, message };
  }
};

export const updateCourse = async (
  id: CourseId,
  course: UpdateCourseParams,
  tx: DrizzleTransaction,
) => {
  const { id: courseId } = courseIdSchema.parse({ id });
  const newCourse = updateCourseSchema.parse(course);
  try {
    const [c] = await tx
      .update(courses)
      .set({ ...newCourse, updatedAt: new Date() })
      .where(eq(courses.id, courseId))
      .returning();
    return { course: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message, message };
  }
};

export const deleteCourse = async (id: CourseId, tx: DrizzleTransaction) => {
  const { id: courseId } = courseIdSchema.parse({ id });
  try {
    const [c] = await tx
      .delete(courses)
      .where(eq(courses.id, courseId))
      .returning();
    return { course: c };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message, message };
  }
};

const initDefaultRoles = async (course: Course, tx: DrizzleTransaction) => {
  try {
    for (const role of defaultRoles) {
      const newRole = await createRole(
        {
          name: role.name,
          courseId: course.id,
          isCourseDefault: role.isDefault,
        },
        tx,
      );

      for (const permission of role.permissions) {
        await enableRolePermission(
          {
            roleId: newRole?.id ?? "",
            permission: permission,
          },
          tx,
        );
      }
    }
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message, message };
  }
};

export const enrolUser = async (courseEnrolment: CourseEnrolment) => {
  const { courseId, userId } =
    insertCourseEnrolmentSchema.parse(courseEnrolment);

  const res = await db
    .select({ defaultRoleId: roles.id })
    .from(roles)
    .where(and(eq(roles.courseId, courseId), eq(roles.isCourseDefault, true)));

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
