import React, { type ReactNode } from "react";

import { verifyProtectedPermission } from "@/server/auth";
import type { PermissionSlug } from "@/server/db/schema/permission";

import ErrorUnauthorizedGraphic from "@/components/common/error-401";
import ErrorForbiddenGraphic from "@/components/common/error-403";

interface ProtectProps {
  courseId: string;
  permissionSlug?: PermissionSlug;
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
  const { access, status } = await verifyProtectedPermission(
    courseId,
    permissionSlug,
    isMember,
  );

  if (!access) {
    if (status === "UNAUTHENTICATED")
      return hidden ? null : <ErrorUnauthorizedGraphic />;
    if (status === "FORBIDDEN")
      return hidden ? null : <ErrorForbiddenGraphic />;
  } else {
    return <>{children}</>;
  }
}
