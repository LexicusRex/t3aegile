"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import {
  createCourseEnrolment,
  deleteCourseEnrolment,
  updateCourseEnrolment,
} from "@/server/api/crud/course-enrolments/mutations";

import { withTransaction } from "../api/crud/utils";
import {
  insertCourseEnrolmentParams,
  updateCourseEnrolmentParams,
  type CourseEnrolmentId,
  type NewCourseEnrolmentParams,
  type UpdateCourseEnrolmentParams,
} from "../db/schema/courseEnrolment";
import { adminProtectedAction, permissionProtectedAction } from "./safe-action";

export const createCourseEnrolmentAction = adminProtectedAction(
  async (input: NewCourseEnrolmentParams) => {
    const payload = insertCourseEnrolmentParams.parse(input);
    await withTransaction(async (tx) => {
      await createCourseEnrolment(payload, tx);
      revalidatePath(`/courses/${payload.courseId}/participants`);
    });
  },
);

export const updateCourseEnrolmentAction = permissionProtectedAction(
  async (input: UpdateCourseEnrolmentParams) => {
    const payload = updateCourseEnrolmentParams.parse(input);
    await withTransaction(async (tx) => {
      await updateCourseEnrolment(payload, tx);
      // revalidateCourses();
    });
  },
  (input) => input.courseId,
  "course:manage_enrolments",
);

export const deleteCourseAction = permissionProtectedAction(
  async (input: CourseEnrolmentId) => {
    // const payload = courseIdSchema.parse({ id: input });
    await withTransaction(async (tx) => {
      await deleteCourseEnrolment(input, tx);
      // revalidateCourses();
    });
  },
  (input) => input.courseId,
  "course:manage_enrolments",
);
