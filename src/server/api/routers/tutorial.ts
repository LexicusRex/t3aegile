import { revalidatePath } from "next/cache";

import {
  createTRPCRouter,
  permissionProtectedProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { checkCoursePermission } from "@/server/auth";
import {
  courseEnrolments,
  rolePermissions,
  tutorials,
} from "@/server/db/schema";
import {
  insertTutorialParams,
  tutorialIdSchema,
  updateTutorialParams,
} from "@/server/db/schema/tutorial";
import {
  insertTutorialEnrolmentSchema,
  tutorialEnrolments,
} from "@/server/db/schema/tutorialEnrolment";
import { and, count, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import {
  PERM_TUTORIAL_MANAGE_CORE,
  PERM_TUTORIAL_MULTI_ENROL,
  PERM_TUTORIAL_VIEW,
} from "@/lib/constants";

import { withTransaction } from "../crud/utils";
import { checkCourseRolePermission } from "./utils";

const bulkInsertTutorialEnrolmentSchema = z.object({
  courseId: z.string(),
  enrolments: z.array(insertTutorialEnrolmentSchema),
});

export const tutorialRouter = createTRPCRouter({
  create: permissionProtectedProcedure(PERM_TUTORIAL_MANAGE_CORE)
    .input(insertTutorialParams)
    .mutation(async ({ ctx, input }) => {
      await withTransaction(async (tx) => {
        await tx.insert(tutorials).values(input).returning();
      });
    }),

  update: permissionProtectedProcedure(PERM_TUTORIAL_MANAGE_CORE)
    .input(updateTutorialParams)
    .mutation(async ({ ctx, input }) => {
      await withTransaction(async (tx) => {
        await tx.update(tutorials).set(input).where(eq(tutorials.id, input.id));
      });
    }),

  delete: permissionProtectedProcedure(PERM_TUTORIAL_MANAGE_CORE)
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await withTransaction(async (tx) => {
        await tx.delete(tutorials).where(eq(tutorials.id, input.id));
      });
    }),

  getById: protectedProcedure
    .input(tutorialIdSchema)
    .query(async ({ ctx, input }) => {
      const [t] = await ctx.db
        .select()
        .from(tutorials)
        .where(eq(tutorials.id, input.id))
        .limit(1);
      return { tutorial: t };
    }),

  getAllByCourseId: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      // check here if the user has access to view all tutorials, or just the tutorials they are in charge of or enrolled in
      const hasTutorialPrivilegedAccess = checkCoursePermission(
        ctx.session.user.id,
        input.courseId,
        PERM_TUTORIAL_VIEW,
      );
      // if (!hasTutorialPrivilegedAccess) {
      //   only return tutorials that the user is enrolled in
      // ctx.db.select().from(tutorials).innerJoin(tutorialEnrolments, eq(courseEnrolments.courseId, courses.id)).where(eq(courseEnrolments.userId, userId));
      const rows = await ctx.db
        .select()
        .from(tutorials)
        .where(eq(tutorials.courseId, input.courseId));
      // .innerJoin(courseEnrolments, eq(courseEnrolments.courseId, courses.id))
      // .where(eq(courseEnrolments.userId, userId));
      return { tutorials: rows };
    }),

  // enrol: permissionProtectedProcedure(PERM_TUTORIAL_MANAGE_CORE)
  //   .input(insertTutorialEnrolmentSchema)
  //   .mutation(async ({ ctx, input }) => {
  //     await withTransaction(async (tx) => {
  //       const preEnrolmentTutorials = await tx
  //         .select()
  //         .from(tutorialEnrolments)
  //         .where(
  //           and(
  //             eq(tutorialEnrolments.courseId, input.courseId),
  //             eq(tutorialEnrolments.userId, input.userId),
  //           ),
  //         );

  //       // check if user's course Role has permission to enrol in the tutorial
  //       const permissionCheck = await tx
  //         .select()
  //         .from(courseEnrolments)
  //         .innerJoin(
  //           rolePermissions,
  //           and(
  //             eq(rolePermissions.roleId, courseEnrolments.roleId),
  //             eq(courseEnrolments.courseId, input.courseId),
  //             eq(courseEnrolments.userId, input.userId),
  //           ),
  //         )
  //         .where(eq(rolePermissions.permission, PERM_TUTORIAL_MULTI_ENROL));

  //       const hasTutorialMultiEnrolmentPermission = permissionCheck.length > 0;

  //       if (
  //         !hasTutorialMultiEnrolmentPermission &&
  //         preEnrolmentTutorials.length > 0
  //       ) {
  //         throw new Error(
  //           "Some users are not allowed multiple tutorial enrolments for this course.",
  //         );
  //       }

  //       await tx.insert(tutorialEnrolments).values(input);
  //     });
  //   }),

  bulkEnrol: permissionProtectedProcedure(PERM_TUTORIAL_MANAGE_CORE)
    .input(bulkInsertTutorialEnrolmentSchema)
    .mutation(async ({ ctx, input }) => {
      const { courseId, enrolments } = input;

      await withTransaction(async (tx) => {
        for (const enrolment of enrolments) {
          const preEnrolmentTutorials = await tx
            .select()
            .from(tutorialEnrolments)
            .where(
              and(
                eq(tutorialEnrolments.courseId, enrolment.courseId),
                eq(tutorialEnrolments.userId, enrolment.userId),
              ),
            );

          const hasTutorialMultiEnrolmentPermission =
            await checkCourseRolePermission(
              tx,
              enrolment.courseId,
              enrolment.userId,
              PERM_TUTORIAL_MULTI_ENROL,
            );
          if (
            !hasTutorialMultiEnrolmentPermission &&
            preEnrolmentTutorials.length > 0
          ) {
            throw new Error(
              "Some users are not allowed multiple tutorial enrolments for this course.",
            );
          }

          await tx.insert(tutorialEnrolments).values(enrolment);
        }
      });
    }),

  bulkUnenrol: permissionProtectedProcedure(PERM_TUTORIAL_MANAGE_CORE)
    .input(bulkInsertTutorialEnrolmentSchema)
    .mutation(async ({ ctx, input }) => {
      const { courseId, enrolments } = input;
      for (const enrolment of enrolments) {
        await withTransaction(async (tx) => {
          await tx
            .delete(tutorialEnrolments)
            .where(
              and(
                eq(tutorialEnrolments.courseId, courseId),
                eq(tutorialEnrolments.userId, enrolment.userId),
                eq(tutorialEnrolments.tutorialId, enrolment.tutorialId),
              ),
            );
        });
      }
    }),
  // create: permissionProtectedProcedure
  //   .input(z.object({ title: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     await ctx.db.insert(tutorials).values({
  //       title: input.title,
  //       createdById: ctx.session.user.id,
  //     });
  //   }),

  // getAll: publicProcedure.query(async ({ ctx }) => {
  //   const tutorial = await ctx.db.query.tutorials.findMany();

  //   return tutorial;
  // }),

  // getById: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const tutorial = await ctx.db.query.tutorials.findUnique({
  //       where: {
  //         id: input.id,
  //       },
  //     });

  //     return tutorial;
  //   }),
});
