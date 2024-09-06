import { Suspense } from "react";

import { getRolePermissions } from "@/server/api/crud/roles/queries";

import { Separator } from "@/components/ui/separator";
import Loading from "@/app/(app)/loading";

import { RolesPermissionsForm } from "./RolePermissionsForm";

interface CoursePageProps {
  params: {
    course_id: string;
    role_id: string;
  };
}

export default async function CourseSettingsPage({ params }: CoursePageProps) {
  const { permissions } = await getRolePermissions(params.role_id);

  return (
    <div className="space-y-6 lg:max-w-2xl">
      <div className="space-y-2">
        <h3 className="font-semibold leading-none tracking-tight">
          Roles & Permissions
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage course roles and permissions.
        </p>
      </div>
      <Separator />
      <Suspense fallback={<Loading />}>
        <RolesPermissionsForm
          roleId={params.role_id}
          permissions={permissions}
        />
      </Suspense>
    </div>
  );
}
