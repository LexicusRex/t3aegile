import type db from ".";

// types.ts
export type DrizzleTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];
