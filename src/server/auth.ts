import { cache } from "react";
import { redirect } from "next/navigation";

import { db } from "@/server/db";
import {
  accounts,
  courseEnrolments,
  permissions,
  rolePermissions,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, eq } from "drizzle-orm";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import type { Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
      isSuperuser: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    // role: UserRole;
    isSuperuser: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        isSuperuser: user.isSuperuser,
      },
    }),
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  // pages: {
  //   signIn: "/signin",
  // }
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = cache(
  async () => await getServerSession(authOptions),
);

export const currentUser = async () => {
  const session = await getServerAuthSession();
  // if (!session) return null;
  if (!session) throw new Error("Not authenticated");
  return session.user;
};

export const checkAuth = async () => {
  const session = await getServerAuthSession();
  // await promise that takes 1 second
  // if (!session) throw new Error("Not authenticated");
  if (!session) redirect("/api/auth/signin");
};

export const testCall = async () => {
  console.log("🚀 ~ testCall ~ FETCHING USER PERMISSIONS");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { "course:create": true };
};

export const hasCoursePermission = async (
  userId: string,
  courseId: string,
  permissionSlug?: string,
) => {
  if (!permissionSlug) return false;
  const prepared = db
    .select()
    .from(courseEnrolments)
    .where(
      and(
        eq(courseEnrolments.userId, userId),
        eq(courseEnrolments.courseId, courseId),
      ),
    )
    // .leftJoin(
    .innerJoin(
      rolePermissions,
      and(
        eq(courseEnrolments.roleId, rolePermissions.roleId),
        eq(rolePermissions.permission, permissionSlug),
      ),
    );
  // .innerJoin(
  //   permissions,
  //   and(
  //     eq(rolePermissions.permissionId, permissions.id),
  //     eq(permissions.slug, permissionSlug),
  //   ),
  // );

  const result = await prepared.execute();
  return result.length > 0;
};

export const checkCoursePermission = cache(
  async (userId: string, courseId: string, permissionSlug?: string) =>
    await hasCoursePermission(userId, courseId, permissionSlug),
);

type VerifyPermissionResult = {
  access: boolean;
  status?: "UNAUTHENTICATED" | "FORBIDDEN";
};

export const verifyProtectedPermission = async (
  courseId: string,
  permissionSlug: string,
  hasMemberOverride = false,
): Promise<VerifyPermissionResult> => {
  const session = await getServerAuthSession();

  if (!session || !session.user || !session.user.id) {
    return { access: false, status: "UNAUTHENTICATED" };
  }

  const userId = session.user.id;

  const hasPermission = await checkCoursePermission(
    userId,
    courseId,
    permissionSlug,
  );

  if (!session.user.isSuperuser && !hasPermission && !hasMemberOverride) {
    return { access: false, status: "FORBIDDEN" };
  }

  return { access: true };
};
