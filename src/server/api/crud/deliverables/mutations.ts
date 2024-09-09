import {
  deliverables,
  updateDeliverableSchema,
  type DeleteDeliverableParams,
  type DeliverableId,
  type NewDeliverableParams,
  type UpdateDeliverableParams,
} from "@/server/db/schema/deliverable";
import type { DrizzleTransaction } from "@/server/db/types";
import { eq } from "drizzle-orm";

import { handleError } from "../utils";

export const createDeliverable = async (
  deliverable: NewDeliverableParams,
  tx: DrizzleTransaction,
) => {
  try {
    const [a] = await tx.insert(deliverables).values(deliverable).returning();
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
  } catch (err) {
    handleError(err);
  }
};
