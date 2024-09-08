import "server-only";

// import { db } from "@/server/db/index";
import { courseEnrolments, courses } from "@/server/db/schema";
import {
  courseEnrolmentIdSchema,
  insertCourseEnrolmentSchema,
  updateCourseEnrolmentSchema,
  type CourseEnrolmentId,
  type NewCourseEnrolmentParams,
  type UpdateCourseEnrolmentParams,
} from "@/server/db/schema/courseEnrolment";
import type { DrizzleTransaction } from "@/server/db/types";
import { and, eq, sql } from "drizzle-orm";

import { getDefaultCourseRole } from "../roles/queries";

export const createCourseEnrolment = async (
  enrolment: NewCourseEnrolmentParams,
  tx: DrizzleTransaction,
) => {
  const newEnrolment = insertCourseEnrolmentSchema.parse(enrolment);
  try {
    const defaultRoleId = await getDefaultCourseRole(newEnrolment.courseId, tx);
    if (!defaultRoleId) throw new Error("Default role not found");

    await tx
      .insert(courseEnrolments)
      .values({ ...newEnrolment, roleId: defaultRoleId });
    await tx
      .update(courses)
      .set({ memberCount: sql`member_count + 1` })
      .where(eq(courses.id, newEnrolment.courseId));
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message, message };
  }
};

export const updateCourseEnrolment = async (
  enrolment: UpdateCourseEnrolmentParams,
  tx: DrizzleTransaction,
) => {
  const updatedEnrolment = updateCourseEnrolmentSchema.parse(enrolment);
  try {
    await tx
      .update(courseEnrolments)
      .set({ ...updatedEnrolment, updatedAt: new Date() })
      .where(eq(courseEnrolments.courseId, updatedEnrolment.courseId));
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message, message };
  }
};

export const deleteCourseEnrolment = async (
  enrolmentIds: CourseEnrolmentId,
  tx: DrizzleTransaction,
) => {
  const { courseId, userId } = courseEnrolmentIdSchema.parse(enrolmentIds);
  try {
    await tx
      .update(courses)
      .set({ memberCount: sql`member_count - 1` })
      .where(eq(courses.id, courseId));
    await tx
      .delete(courseEnrolments)
      .where(
        and(
          eq(courseEnrolments.userId, userId),
          eq(courseEnrolments.courseId, courseId),
        ),
      );
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message, message };
  }
};
