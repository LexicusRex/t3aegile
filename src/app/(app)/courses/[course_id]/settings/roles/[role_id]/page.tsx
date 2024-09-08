import { Suspense } from "react";
import { notFound } from "next/navigation";

import {
  getRoleById,
  getRolePermissions,
} from "@/server/api/crud/roles/queries";

import { Separator } from "@/components/ui/separator";
import RoleSettingsDeleteForm from "@/components/forms/roles/settings-delete-form";
import { RolesPermissionsForm } from "@/components/forms/roles/settings-edit-form";
import Loading from "@/app/(app)/loading";

interface CoursePageProps {
  params: {
    course_id: string;
    role_id: string;
  };
}

export default async function CourseSettingsPage({ params }: CoursePageProps) {
  const { permissions } = await getRolePermissions(params.role_id);
  const { role } = await getRoleById(params.role_id);
  if (!role) return notFound();

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
        <div className="space-y-8 pb-12">
          <RolesPermissionsForm
            courseId={params.course_id}
            role={role}
            permissions={permissions}
          />
          <RoleSettingsDeleteForm roleId={params.role_id} />
        </div>
      </Suspense>
    </div>
  );
}
