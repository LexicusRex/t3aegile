import "server-only";

import { db } from "@/server/db/index";
import {
  courseEnrolments,
  tutorialEnrolments,
  tutorials,
} from "@/server/db/schema";
import { users } from "@/server/db/schema/auth";
import {
  courseIdSchema,
  courses,
  type CourseId,
} from "@/server/db/schema/course";
import { roles } from "@/server/db/schema/role";
import type { TutorialCore } from "@/server/db/schema/tutorial";
import { and, eq, isNull, sql } from "drizzle-orm";

import type { CourseEnrollable, CourseParticipant } from "./types";

export const getCourses = async () => {
  const rows = await db.select().from(courses);
  const c = rows;
  return { courses: c };
};

export const getCourseEnrollable = async (courseId: CourseId) => {
  const { id } = courseIdSchema.parse({ id: courseId });
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
    })
    .from(users)
    .leftJoin(
      courseEnrolments,
      and(
        eq(courseEnrolments.userId, users.id),
        eq(courseEnrolments.courseId, id),
      ),
    )
    .where(isNull(courseEnrolments.courseId));

  const c: CourseEnrollable[] = rows;
  return { enrollable: c };
};

export const getCourseEnrolments = async (courseId: CourseId) => {
  const { id } = courseIdSchema.parse({ id: courseId });
  // const rows = await db
  //   .select({
  //     id: users.id,
  //     name: users.name,
  //     email: users.email,
  //     image: users.image,
  //     role: roles.name,
  //   })
  //   .from(courseEnrolments)
  //   .where(eq(courseEnrolments.courseId, id))
  //   .innerJoin(users, eq(users.id, courseEnrolments.userId))
  //   .innerJoin(roles, eq(roles.id, courseEnrolments.roleId));

  // const c: CourseParticipant[] = rows;
  // return { participants: c };

  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: roles.name,
      tutorials: sql<string[]>`
        COALESCE(
          array_agg(${tutorials.name}) FILTER (WHERE ${tutorials.id} IS NOT NULL),
          ARRAY[]::text[]
        )
      `.as("tutorials"),
      // tutorials: sql<object>`
      //   COALESCE(
      //     json_agg(
      //       json_build_object(
      //         'id', ${tutorials.id},
      //         'name', ${tutorials.name}
      //       )
      //     ) FILTER (WHERE ${tutorials.id} IS NOT NULL),
      //     '[]'
      //   )
      // `.as("tutorials"),
    })
    .from(courseEnrolments)
    .where(eq(courseEnrolments.courseId, id))
    .innerJoin(users, eq(users.id, courseEnrolments.userId))
    .innerJoin(roles, eq(roles.id, courseEnrolments.roleId))
    .leftJoin(
      tutorialEnrolments,
      and(
        eq(tutorialEnrolments.userId, courseEnrolments.userId),
        eq(tutorialEnrolments.courseId, courseEnrolments.courseId),
      ),
    )
    .leftJoin(tutorials, eq(tutorials.id, tutorialEnrolments.tutorialId))
    .groupBy(users.id, users.name, users.email, users.image, roles.name);

  const participants: CourseParticipant[] = result.map((row) => {
    return {
      ...row,
      // tutorials: row.tutorials as TutorialCore[],
      tutorials: row.tutorials,
    };
  });

  return { participants };
};
