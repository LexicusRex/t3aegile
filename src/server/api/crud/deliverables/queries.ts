import db from "@/server/db";
import type { AssignmentId } from "@/server/db/schema/assignment";
import {
  deliverableIdSchema,
  deliverables,
  type DeliverableId,
} from "@/server/db/schema/deliverable";
import { eq } from "drizzle-orm";

export const getDeliverableById = async (deliverableId: DeliverableId) => {
  const { id } = deliverableIdSchema.parse({ id: deliverableId });
  const [delv] = await db
    .select()
    .from(deliverables)
    .where(eq(deliverables.id, id))
    .limit(1);

  return { deliverable: delv };
};

export const getDeliverablesByAssignment = async (
  assignmentId: AssignmentId,
) => {
  const delvs = await db
    .select()
    .from(deliverables)
    .where(eq(deliverables.assignmentId, assignmentId));

  return { deliverables: delvs };
};
