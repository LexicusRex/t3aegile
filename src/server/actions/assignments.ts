"use server";

import { revalidatePath } from "next/cache";

import { PERM_ASSIGNMENT_MANAGE_CORE } from "@/lib/constants";

import { createAssignment } from "../api/crud/assignments/mutations";
import { withTransaction } from "../api/crud/utils";
import { type NewAssignmentParams } from "../db/schema/assignment";
import { permissionProtectedAction } from "./safe-action";

export const createAssignmentAction = permissionProtectedAction(
  async (input: NewAssignmentParams) => {
    await withTransaction(async (tx) => {
      const res = await createAssignment(input, tx);
      console.log("🚀 ~ awaitwithTransaction ~ res:", res);
      revalidatePath(`/courses/${input.courseId}/assignments`);
    });
  },
  (input) => input.courseId,
  PERM_ASSIGNMENT_MANAGE_CORE,
);
