import {
  createTRPCRouter,
  permissionProtectedProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { checkCoursePermission } from "@/server/auth";
import {
  courseEnrolments,
  groupEnrolments,
  groups,
  rolePermissions,
  tutorialEnrolments,
  tutorials,
  users,
} from "@/server/db/schema";
import { assignmentIdSchema, assignments } from "@/server/db/schema/assignment";
import { insertGroupSchema } from "@/server/db/schema/group";
import { and, count, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import {
  PERM_ASSIGNMENT_SUBMISSION_LIABLE,
  PERM_GROUP_MANAGE_CORE,
  PERM_GROUP_MANAGE_ENROLMENTS,
} from "@/lib/constants";

import { withTransaction } from "../crud/utils";
import { checkCourseRolePermission } from "./utils";

export const groupRouter = createTRPCRouter({
  getAllByAssignmentId: protectedProcedure
    .input(assignmentIdSchema)
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select()
        .from(groups)
        .where(eq(groups.assignmentId, input.id));
      return { groups: rows };
    }),

  getAllUserGroupsByAssignmentId: protectedProcedure
    .input(assignmentIdSchema)
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({
          id: groups.id,
          name: groups.name,
          identifier: groups.identifier,
          users: sql<object>`
            COALESCE(
              json_agg(
                json_build_object(
                  'name', ${users.name}, 
                  'image', ${users.image}
                ) 
              ) FILTER (WHERE ${users.id} IS NOT NULL), 
              '[]'
            )
          `.as("users"),
        })
        .from(groups)
        .leftJoin(
          groupEnrolments,
          and(
            eq(groups.assignmentId, input.id),
            eq(groups.id, groupEnrolments.groupId),
          ),
        )
        .leftJoin(users, eq(groupEnrolments.userId, users.id))
        .groupBy(groups.id);
      return { teams: rows };
    }),

  create: permissionProtectedProcedure(PERM_GROUP_MANAGE_CORE)
    .input(insertGroupSchema)
    .mutation(async ({ ctx, input }) => {
      const [isGroup] = await ctx.db
        .select()
        .from(assignments)
        .where(
          and(
            eq(assignments.id, input.assignmentId),
            eq(assignments.isGroup, true),
          ),
        )
        .limit(1);
      if (!isGroup) throw new Error("Assignment is not a group assignment");

      await ctx.db.insert(groups).values(input);
      return { success: true };
    }),

  bulkInsertGroupEnrolment: permissionProtectedProcedure(
    PERM_GROUP_MANAGE_ENROLMENTS,
  )
    .input(
      z.object({
        assignmentId: z.string(),
        userIds: z.array(z.string()),
        groupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { assignmentId, userIds, groupId } = input;
      await withTransaction(async (tx) => {
        for (const userId of userIds) {
          await tx.insert(groupEnrolments).values({
            userId,
            groupId,
            assignmentId,
          });
        }
      });

      return { success: true };
    }),
  bulkDeleteGroupEnrolment: permissionProtectedProcedure(
    PERM_GROUP_MANAGE_ENROLMENTS,
  )
    .input(
      z.object({
        userIds: z.array(z.string()),
        groupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userIds, groupId } = input;
      await withTransaction(async (tx) => {
        for (const userId of userIds) {
          await tx
            .delete(groupEnrolments)
            .where(
              and(
                eq(groupEnrolments.groupId, groupId),
                eq(groupEnrolments.userId, userId),
              ),
            );
        }
      });

      return { success: true };
    }),
});
