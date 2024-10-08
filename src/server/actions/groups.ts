"use server";

import { revalidatePath } from "next/cache";

import { api } from "@/trpc/server";

import { handleErrors } from "./safe-action";

export const createGroupAction = async (input: {
  courseId: string;
  assignmentId: string;
  name: string;
  identifier: string;
}) => {
  try {
    await api.group.create(input);
    revalidatePath(
      `/courses/${input.courseId}/assignments/${input.assignmentId}`,
    );
  } catch (error) {
    return handleErrors(error);
  }
};

export const bulkGroupEnrolmentAction = async (input: {
  courseId: string;
  userIds: string[];
  groupId: string;
  assignmentId: string;
}) => {
  if (input.userIds.length === 0) return;
  if (!input.groupId) return;
  try {
    await api.group.bulkInsertGroupEnrolment(input);
    revalidatePath(
      `/courses/${input.courseId}/assignments/${input.assignmentId}`,
    );
  } catch (error) {
    return handleErrors(error);
  }
};

export const bulkGroupUnenrolmentAction = async (input: {
  courseId: string;
  userIds: string[];
  groupId: string;
  assignmentId: string;
}) => {
  if (input.userIds.length === 0) return;
  if (!input.groupId) return;
  try {
    const { assignmentId, ...rest } = input;
    await api.group.bulkDeleteGroupEnrolment(rest);
    revalidatePath(`/courses/${input.courseId}/assignments/${assignmentId}`);
  } catch (error) {
    return handleErrors(error);
  }
};
