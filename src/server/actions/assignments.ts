"use server";

import { revalidatePath } from "next/cache";

import { PERM_ASSIGNMENT_MANAGE_CORE } from "@/lib/constants";

import {
  createAssignment,
  deleteAssignment,
  updateAssignment,
} from "../api/crud/assignments/mutations";
import { withTransaction } from "../api/crud/utils";
import type {
  DeleteAssignmentParams,
  NewAssignmentParams,
  UpdateAssignmentParams,
} from "../db/schema/assignment";
import { permissionProtectedAction } from "./safe-action";

export const createAssignmentAction = permissionProtectedAction(
  async (input: NewAssignmentParams) => {
    await withTransaction(async (tx) => {
      await createAssignment(input, tx);
      revalidatePath(`/courses/${input.courseId}/assignments`);
    });
  },
  (input) => input.courseId,
  PERM_ASSIGNMENT_MANAGE_CORE,
);

export const updateAssignmentAction = permissionProtectedAction(
  async (input: UpdateAssignmentParams) => {
    await withTransaction(async (tx) => {
      const ass = await updateAssignment(input, tx);
      revalidatePath(`/courses/${ass?.courseId}/assignments`);
    });
  },
  (input) => input.courseId,
  PERM_ASSIGNMENT_MANAGE_CORE,
);

export const deleteAssignmentAction = permissionProtectedAction(
  async (input: DeleteAssignmentParams) => {
    await withTransaction(async (tx) => {
      await deleteAssignment(input, tx);
      // revalidatePath(`/courses/${input.courseId}/assignments`);
    });
  },
  (input) => input.courseId,
  PERM_ASSIGNMENT_MANAGE_CORE,
);
