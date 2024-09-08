import {
  assignments,
  type NewAssignmentParams,
} from "@/server/db/schema/assignment";
import type { DrizzleTransaction } from "@/server/db/types";

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
