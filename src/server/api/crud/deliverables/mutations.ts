import { assignments } from "@/server/db/schema/assignment";
import {
  deliverables,
  updateDeliverableSchema,
  type DeleteDeliverableParams,
  type NewDeliverableParams,
  type UpdateDeliverableParams,
} from "@/server/db/schema/deliverable";
import type { DrizzleTransaction } from "@/server/db/types";
import { asc, desc, eq, sum } from "drizzle-orm";

import { handleError } from "../utils";

const getTotalDeliverableWeightingByAssignmentId = async (
  tx: DrizzleTransaction,
  assignmentId: string,
) => {
  const [result] = await tx
    .select({ value: sum(deliverables.weighting) })
    .from(deliverables)
    .where(eq(deliverables.assignmentId, assignmentId));

  return Number(result?.value) ?? 0;
};

const getEarliestDeliverableByAssignmentId = async (
  tx: DrizzleTransaction,
  assignmentId: string,
) => {
  const [result] = await tx
    .select({ deadline: deliverables.deadline })
    .from(deliverables)
    .where(eq(deliverables.assignmentId, assignmentId))
    .orderBy(asc(deliverables.deadline))
    .limit(1);

  return result;
};

const deliverableConstraintChecks = async (
  tx: DrizzleTransaction,
  deliverable: NewDeliverableParams | UpdateDeliverableParams,
) => {
  if (deliverable.deadline <= new Date()) {
    throw new Error("Available date must be before deadline");
  }

  if (deliverable.availableAt >= deliverable.deadline) {
    throw new Error("Available date must be before deadline");
  }

  if (deliverable.cutoff < deliverable.deadline) {
    throw new Error("Cutoff date must be on or after deadline");
  }

  const total = await getTotalDeliverableWeightingByAssignmentId(
    tx,
    deliverable.assignmentId,
  );
  if (total + deliverable.weighting > 100) {
    throw new Error("Total weighting exceeds 100");
  }
};

const updateAssignmentNextDeadline = async (
  tx: DrizzleTransaction,
  assignmentId: string,
) => {
  const latestDeliverable = await getEarliestDeliverableByAssignmentId(
    tx,
    assignmentId,
  );
  if (latestDeliverable) {
    await tx
      .update(assignments)
      .set({ nextDeadline: latestDeliverable.deadline })
      .where(eq(assignments.id, assignmentId));
  }
};

export const createDeliverable = async (
  deliverable: NewDeliverableParams,
  tx: DrizzleTransaction,
) => {
  try {
    await deliverableConstraintChecks(tx, deliverable);
    const [a] = await tx.insert(deliverables).values(deliverable).returning();
    await updateAssignmentNextDeadline(tx, deliverable.assignmentId);
    return { ...a };
  } catch (err) {
    handleError(err);
  }
};

export const updateDeliverable = async (
  deliverable: UpdateDeliverableParams,
  tx: DrizzleTransaction,
) => {
  const updatedDeliverable = updateDeliverableSchema.parse(deliverable);
  try {
    const [ass] = await tx
      .update(deliverables)
      .set(updatedDeliverable)
      .where(eq(deliverables.id, deliverable.id))
      .returning();

    await deliverableConstraintChecks(tx, deliverable);
    await updateAssignmentNextDeadline(tx, deliverable.assignmentId);

    return ass;
  } catch (err) {
    handleError(err);
  }
};

export const deleteDeliverable = async (
  deliverable: DeleteDeliverableParams,
  tx: DrizzleTransaction,
) => {
  try {
    await tx.delete(deliverables).where(eq(deliverables.id, deliverable.id));
    await updateAssignmentNextDeadline(tx, deliverable.assignmentId);
  } catch (err) {
    handleError(err);
  }
};
