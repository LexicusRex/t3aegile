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
import { and, count, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import { PERM_ASSIGNMENT_SUBMISSION_LIABLE } from "@/lib/constants";

import { withTransaction } from "../crud/utils";
import { checkCourseRolePermission } from "./utils";

export const assignmentRouter = createTRPCRouter({
  // getById: protectedProcedure
  //   .input(tutorialIdSchema)
  //   .query(async ({ ctx, input }) => {
  //     const [t] = await ctx.db
  //       .select()
  //       .from(tutorials)
  //       .where(eq(tutorials.id, input.id))
  //       .limit(1);
  //     return { tutorial: t };
  //   }),

  getAssessableMembersByAssignmentId: protectedProcedure
    .input(z.object({ courseId: z.string(), assignmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({
          userId: users.id,
          name: users.name,
          email: users.email,
          tutorials: sql<string[]>`
            COALESCE(
              array_agg(${tutorials.name}) FILTER (WHERE ${tutorials.id} IS NOT NULL),
              ARRAY[]::text[]
            )
          `.as("tutorials"),
          group: groups.name,
        })
        .from(courseEnrolments)
        .innerJoin(
          rolePermissions,
          and(
            eq(courseEnrolments.courseId, input.courseId),
            eq(rolePermissions.permission, PERM_ASSIGNMENT_SUBMISSION_LIABLE),
            eq(rolePermissions.roleId, courseEnrolments.roleId),
          ),
        )
        .innerJoin(users, eq(users.id, courseEnrolments.userId))
        .leftJoin(
          tutorialEnrolments,
          and(
            eq(tutorialEnrolments.userId, courseEnrolments.userId),
            eq(tutorialEnrolments.courseId, courseEnrolments.courseId),
          ),
        )
        .leftJoin(tutorials, eq(tutorials.id, tutorialEnrolments.tutorialId))
        .leftJoin(
          groupEnrolments,
          and(
            eq(groupEnrolments.userId, courseEnrolments.userId),
            eq(groupEnrolments.assignmentId, input.assignmentId),
          ),
        )
        .leftJoin(groups, eq(groups.id, groupEnrolments.groupId))
        .groupBy(users.id, groups.name);
      return { members: rows };
    }),

  // geAllByCourseId: protectedProcedure
  //   .input(z.object({ courseId: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     // check here if the user has access to view all tutorials, or just the tutorials they are in charge of or enrolled in
  //     const hasTutorialPrivilegedAccess = checkCoursePermission(
  //       ctx.session.user.id,
  //       input.courseId,
  //       PERM_TUTORIAL_VIEW,
  //     );
  //     // if (!hasTutorialPrivilegedAccess) {
  //     //   only return tutorials that the user is enrolled in
  //     // ctx.db.select().from(tutorials).innerJoin(tutorialEnrolments, eq(courseEnrolments.courseId, courses.id)).where(eq(courseEnrolments.userId, userId));
  //     const rows = await ctx.db
  //       .select()
  //       .from(tutorials)
  //       .where(eq(tutorials.courseId, input.courseId));
  //     // .innerJoin(courseEnrolments, eq(courseEnrolments.courseId, courses.id))
  //     // .where(eq(courseEnrolments.userId, userId));
  //     return { tutorials: rows };
  //   }),
});
