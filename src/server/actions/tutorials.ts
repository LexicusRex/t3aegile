"use server";

import { revalidatePath } from "next/cache";

import type { CourseId } from "@/server/db/schema/course";
import { api } from "@/trpc/server";

import type {
  NewTutorialParams,
  TutorialId,
  UpdateTutorialParams,
} from "../db/schema/tutorial";
import { handleErrors } from "./safe-action";

export const createTutorialAction = async (input: NewTutorialParams) => {
  try {
    await api.tutorial.create(input);
    revalidatePath(`/courses/${input.courseId}/tutorials`);
    // return mutation.mutateAsync(input);
  } catch (error) {
    return handleErrors(error);
  }
};

export const updateTutorialAction = async (input: UpdateTutorialParams) => {
  try {
    await api.tutorial.update(input);
    revalidatePath(`/courses/${input.courseId}/tutorials/${input.id}/settings`);
  } catch (error) {
    return handleErrors(error);
  }
};

export const deleteTutorialAction = async (input: {
  id: TutorialId;
  courseId: CourseId;
}) => {
  try {
    await api.tutorial.delete(input);
    revalidatePath(`/courses/${input.courseId}/tutorials`);
  } catch (error) {
    return handleErrors(error);
  }
};

type TutorialEnrolmentMutationInput = {
  courseId: CourseId;
  tutorialId: TutorialId;
  userId: string;
};

export const bulkInsertTutorialEnrolmentAction = async (input: {
  courseId: CourseId;
  enrolments: TutorialEnrolmentMutationInput[];
}) => {
  if (input.enrolments.length === 0) return;
  try {
    // for (const enrolment of input.enrolments) {
    //   await api.tutorial.enrol(enrolment);
    // }
    await api.tutorial.bulkEnrol(input);
    revalidatePath(`/courses/${input.courseId}/tutorials`);
  } catch (error) {
    return handleErrors(error);
  }
};
export const bulkDeleteTutorialEnrolmentAction = async (input: {
  courseId: CourseId;
  enrolments: TutorialEnrolmentMutationInput[];
}) => {
  if (input.enrolments.length === 0) return;
  try {
    await api.tutorial.bulkUnenrol(input);
    revalidatePath(`/courses/${input.courseId}/tutorials`);
  } catch (error) {
    return handleErrors(error);
  }
};
// export const createTutorialAction = (input: NewTutorialParams) => {
//   const createTutorial = api.tutorial.create.useMutation({
//     onError(error, variables, context) {
//       console.error("onError", error);
//     },
//     onSuccess(data, variables, context) {
//       console.log("onSuccess", data);
//     },
//   });

//   return createTutorial.mutateAsync(input);
// };
