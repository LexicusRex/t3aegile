"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import {
  createCourse,
  deleteCourse,
  updateCourse,
} from "@/server/api/crud/courses/mutations";
import {
  courseIdSchema,
  insertCourseParams,
  updateCourseParams,
  type CourseId,
  type NewCourseParams,
  type UpdateCourseParams,
} from "@/server/db/schema/course";

import { PERM_COURSE_MANAGE_CORE } from "@/lib/constants";

import { withTransaction } from "../api/crud/utils";
import { adminProtectedAction, permissionProtectedAction } from "./safe-action";

const revalidateCourses = () => revalidatePath("/courses");

export const createCourseAction = adminProtectedAction(
  async (input: NewCourseParams) => {
    const payload = insertCourseParams.parse(input);
    await withTransaction(async (tx) => {
      await createCourse(payload, tx);
      revalidateCourses();
    });
  },
);

export const updateCourseAction = permissionProtectedAction(
  async (input: UpdateCourseParams) => {
    const payload = updateCourseParams.parse(input);
    await withTransaction(async (tx) => {
      await updateCourse(payload.id, payload, tx);
      revalidateCourses();
    });
  },
  (input) => input.id,
  PERM_COURSE_MANAGE_CORE,
);

export const deleteCourseAction = permissionProtectedAction(
  async (input: CourseId) => {
    const payload = courseIdSchema.parse({ id: input });
    await withTransaction(async (tx) => {
      await deleteCourse(payload.id, tx);
      revalidateCourses();
    });
  },
  (input) => input,
  PERM_COURSE_MANAGE_CORE,
);
