import {
  assignments,
  updateAssignmentSchema,
  type AssignmentId,
  type DeleteAssignmentParams,
  type NewAssignmentParams,
  type UpdateAssignmentParams,
} from "@/server/db/schema/assignment";
import type { DrizzleTransaction } from "@/server/db/types";
import { eq } from "drizzle-orm";

import { handleError } from "../utils";

export const createAssignment = async (
  assignment: NewAssignmentParams,
  tx: DrizzleTransaction,
) => {
  try {
    const [a] = await tx.insert(assignments).values(assignment).returning();
    return { ...a };
  } catch (err) {
    handleError(err);
  }
};

export const updateAssignment = async (
  assignment: UpdateAssignmentParams,
  tx: DrizzleTransaction,
) => {
  const updatedAssignment = updateAssignmentSchema.parse(assignment);
  try {
    const [ass] = await tx
      .update(assignments)
      .set(updatedAssignment)
      .where(eq(assignments.id, assignment.id))
      .returning();
    return ass;
  } catch (err) {
    handleError(err);
  }
};

export const deleteAssignment = async (
  assignment: DeleteAssignmentParams,
  tx: DrizzleTransaction,
) => {
  try {
    await tx.delete(assignments).where(eq(assignments.id, assignment.id));
  } catch (err) {
    handleError(err);
  }
};
