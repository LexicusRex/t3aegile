import { db } from "@/server/db";
import type { DrizzleTransaction } from "@/server/db/types";

// A higher-order function to inject a transaction into the given function
export const withTransaction = async <T>(
  fn: (tx: DrizzleTransaction) => Promise<T>,
) => {
  return await db.transaction(async (tx) => {
    // try {
    return await fn(tx);
    // } catch (err) {
    //   const message = (err as Error).message ?? "Error, please try again";
    //   console.error("[tx]", message);
    //   throw { error: message, message };
    // }
  });
};

export const handleError = (err: unknown) => {
  const message = (err as Error).message ?? "Error, please try again";
  console.error(message);
  throw { error: message, message };
};
