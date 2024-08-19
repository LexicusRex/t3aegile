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

import { withTransaction } from "../api/crud/utils";
import { adminProtectedAction, permissionProtectedAction } from "./safe-action";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateCourses = () => revalidatePath("/courses");

// export const createCourseAction = async (input: NewCourseParams) => {
//   try {
//     const payload = insertCourseParams.parse(input);
//     await withTransaction(async (tx) => {
//       await createCourse(payload, tx);
//       revalidateCourses();
//     });
//   } catch (e) {
//     return handleErrors(e);
//   }
// };

export const createCourseAction = adminProtectedAction(
  async (input: NewCourseParams) => {
    const payload = insertCourseParams.parse(input);
    await withTransaction(async (tx) => {
      await createCourse(payload, tx);
      revalidateCourses();
    });
  },
);

// export const updateCourseAction = async (input: UpdateCourseParams) => {
//   try {
//     const payload = updateCourseParams.parse(input);
//     await withTransaction(async (tx) => {
//       await updateCourse(payload.id, payload, tx);
//       revalidateCourses();
//     });
//   } catch (e) {
//     return handleErrors(e);
//   }
// };

export const updateCourseAction = permissionProtectedAction(
  async (input: UpdateCourseParams) => {
    const payload = updateCourseParams.parse(input);
    await withTransaction(async (tx) => {
      await updateCourse(payload.id, payload, tx);
      revalidateCourses();
    });
  },
  (input) => input.id,
  "course:manage_core",
);

// export const deleteCourseAction = async (input: CourseId) => {
//   try {
//     const payload = courseIdSchema.parse({ id: input });
//     await withTransaction(async (tx) => {
//       await deleteCourse(payload.id, tx);
//       revalidateCourses();
//     });
//   } catch (e) {
//     return handleErrors(e);
//   }
// };

export const deleteCourseAction = permissionProtectedAction(
  async (input: CourseId) => {
    const payload = courseIdSchema.parse({ id: input });
    await withTransaction(async (tx) => {
      await deleteCourse(payload.id, tx);
      revalidateCourses();
    });
  },
  (input) => input,
  "course:manage_core",
);
