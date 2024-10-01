import {
  createTRPCRouter,
  perrmissionProtectedProcedure,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { checkCoursePermission } from "@/server/auth";
import { tutorials } from "@/server/db/schema";
import {
  insertTutorialParams,
  tutorialIdSchema,
  updateTutorialParams,
} from "@/server/db/schema/tutorial";
import {
  insertTutorialEnrolmentSchema,
  tutorialEnrolments,
} from "@/server/db/schema/tutorialEnrolment";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { PERM_TUTORIAL_MANAGE_CORE, PERM_TUTORIAL_VIEW } from "@/lib/constants";

import { withTransaction } from "../crud/utils";

export const tutorialRouter = createTRPCRouter({
  create: perrmissionProtectedProcedure(PERM_TUTORIAL_MANAGE_CORE)
    .input(insertTutorialParams)
    .mutation(async ({ ctx, input }) => {
      await withTransaction(async (tx) => {
        await tx.insert(tutorials).values(input).returning();
      });
    }),

  update: perrmissionProtectedProcedure(PERM_TUTORIAL_MANAGE_CORE)
    .input(updateTutorialParams)
    .mutation(async ({ ctx, input }) => {
      await withTransaction(async (tx) => {
        await tx.update(tutorials).set(input).where(eq(tutorials.id, input.id));
      });
    }),

  delete: perrmissionProtectedProcedure(PERM_TUTORIAL_MANAGE_CORE)
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

  enrol: perrmissionProtectedProcedure(PERM_TUTORIAL_MANAGE_CORE)
    .input(insertTutorialEnrolmentSchema)
    .mutation(async ({ ctx, input }) => {
      await withTransaction(async (tx) => {
        await tx.insert(tutorialEnrolments).values(input).returning();
      });
    }),
  // create: perrmissionProtectedProcedure
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
