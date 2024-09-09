"use server";

import { revalidatePath } from "next/cache";

import { PERM_ASSIGNMENT_MANAGE_CORE } from "@/lib/constants";

import {
  createDeliverable,
  deleteDeliverable,
  updateDeliverable,
} from "../api/crud/deliverables/mutations";
import { withTransaction } from "../api/crud/utils";
import type {
  DeleteDeliverableParams,
  NewDeliverableParams,
  UpdateDeliverableParams,
} from "../db/schema/deliverable";
import { permissionProtectedAction } from "./safe-action";

export const createDeliverableAction = permissionProtectedAction(
  async (input: NewDeliverableParams) => {
    await withTransaction(async (tx) => {
      await createDeliverable(input, tx);
      revalidatePath(`/courses/${input.courseId}/deliverables`);
    });
  },
  (input) => input.courseId,
  PERM_ASSIGNMENT_MANAGE_CORE,
);

export const updateDeliverableAction = permissionProtectedAction(
  async (input: UpdateDeliverableParams) => {
    await withTransaction(async (tx) => {
      await updateDeliverable(input, tx);
      revalidatePath(`/courses/${input?.courseId}/deliverables`);
    });
  },
  (input) => input.courseId,
  PERM_ASSIGNMENT_MANAGE_CORE,
);

export const deleteDeliverableAction = permissionProtectedAction(
  async (input: DeleteDeliverableParams) => {
    await withTransaction(async (tx) => {
      await deleteDeliverable(input, tx);
      // revalidatePath(`/courses/${input.courseId}/deliverables`);
    });
  },
  (input) => input.courseId,
  PERM_ASSIGNMENT_MANAGE_CORE,
);
