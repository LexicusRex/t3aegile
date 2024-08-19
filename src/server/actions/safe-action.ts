import { checkCoursePermission, getServerAuthSession } from "@/server/auth"; // Assumed path to your permission check function

import { type CourseId } from "@/server/db/schema/course";

type ActionFunction<T> = (input: T) => Promise<void | string>;

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

export const adminProtectedAction = <T>(
  action: ActionFunction<T>,
): ActionFunction<T> => {
  return async (input: T) => {
    try {
      const session = await getServerAuthSession();

      if (!session || !session.user || !session.user.id) {
        throw new Error("User is unauthenticated!");
      }

      if (!session.user.isSuperuser) {
        throw new Error("User is unauthorized! Superuser access required.");
      }

      return action(input);
    } catch (e) {
      return handleErrors(e);
    }
  };
};

export const permissionProtectedAction = <T>(
  action: ActionFunction<T>,
  getCourseId: (input: T) => CourseId | null, // CourseId extractor
  permissionSlug?: string, // Permission slug
): ActionFunction<T> => {
  return async (input: T) => {
    try {
      const session = await getServerAuthSession();

      if (!session || !session.user || !session.user.id) {
        throw new Error("User is unauthenticated!");
      }

      if (session.user.isSuperuser) {
        return action(input);
      }

      const userId = session.user.id;

      const courseId = getCourseId(input);
      //    ^?

      if (!courseId) {
        throw new Error("Course ID is required for permission check.");
      }

      const hasPermission: boolean = await checkCoursePermission(
        userId,
        courseId,
        permissionSlug,
      );

      if (!hasPermission) {
        throw new Error("User is unauthorized!");
      }

      return action(input);
    } catch (e) {
      return handleErrors(e);
    }
  };
};
