import React, { type ReactNode } from "react";

import { checkCoursePermission, getServerAuthSession } from "@/server/auth";

import ErrorForbiddenGraphic from "@/components/common/error-403";

interface ProtectProps {
  courseId: string;
  permissionSlug: string;
  isMember?: boolean;
  hidden?: boolean;
  children: ReactNode;
}

export default async function Protect({
  courseId,
  permissionSlug,
  isMember = false,
  hidden = false,
  children,
}: ProtectProps) {
  const session = await getServerAuthSession();

  if (!session || !session.user || !session.user.id) {
    return hidden ? null : <ErrorForbiddenGraphic />; // or return a fallback component like <Unauthorized />
  }

  const userId = session.user.id;

  const hasPermission = await checkCoursePermission(
    userId,
    courseId,
    permissionSlug,
  );

  // !session.user.isSuperuser && !hasPermission && isMember -> pass
  // !session.user.isSuperuser && !hasPermission && !isMember -> fail
  // !session.user.isSuperuser && hasPermission && !isMember -> pass
  // session.user.isSuperuser && !hasPermission && !isMember -> pass
  // console.log("🚀 ~ session.user.isSuperuser:", session.user.isSuperuser);
  // console.log("🚀 ~ hasPermission:", hasPermission);
  // console.log("🚀 ~ isMember:", isMember);
  // console.log(
  //   "🚀 ~ isBlocked:",
  //   !session.user.isSuperuser && !hasPermission && !isMember,
  // );
  if (!session.user.isSuperuser && !hasPermission && !isMember) {
    return hidden ? null : <ErrorForbiddenGraphic />;
  }

  return <>{children}</>;
}
