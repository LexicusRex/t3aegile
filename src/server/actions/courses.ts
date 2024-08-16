"use server";

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

export const createCourseAction = async (input: NewCourseParams) => {
  try {
    const payload = insertCourseParams.parse(input);
    console.log("🚀 ~ createCourseAction ~ payload:", payload);
    await createCourse(payload);
    revalidateCourses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateCourseAction = async (input: UpdateCourseParams) => {
  try {
    const payload = updateCourseParams.parse(input);
    await updateCourse(payload.id, payload);
    revalidateCourses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteCourseAction = async (input: CourseId) => {
  try {
    const payload = courseIdSchema.parse({ id: input });
    await deleteCourse(payload.id);
    revalidateCourses();
  } catch (e) {
    return handleErrors(e);
  }
};
