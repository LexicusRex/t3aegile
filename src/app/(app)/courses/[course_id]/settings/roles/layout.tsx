import type { Metadata } from "next";

import { getCourseRoles } from "@/server/api/crud/roles/queries";

import { PERM_ROLE_MANAGE } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import { RoleCreationForm } from "@/components/forms/roles/settings-create-form";
import Protect from "@/components/protect";
import { SettingsNav } from "@/components/settings-nav";

export const metadata: Metadata = {
  title: "Course Settings",
};

interface CourseSettingsLayoutProps {
  params: { course_id: string };
  children: React.ReactNode;
}

export default async function CourseSettingsLayout({
  params,
  children,
}: CourseSettingsLayoutProps) {
  const { roles } = await getCourseRoles(params.course_id);

  const settingsNavItems = [
    {
      title: "Overview",
      href: `/courses/${params.course_id}/settings/roles`,
      pattern: "/settings/roles$",
    },
    ...roles.map((role) => ({
      title: `${"\u00A0".repeat(4)}${role.name}`,
      href: `/courses/${params.course_id}/settings/roles/${role.id}`,
      pattern: `/settings/roles/${role.id}$`,
    })),
  ];
  return (
    <Protect courseId={params.course_id} permissionSlug={PERM_ROLE_MANAGE}>
      <div className="flex flex-1 flex-col space-y-8 md:flex-row lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="w-full flex-1 lg:max-w-2xl">{children}</div>
        <aside className="sticky top-16 -mx-4 self-start lg:w-1/5">
          <SettingsNav items={settingsNavItems} />
          <Separator className="my-2" />
          <RoleCreationForm courseId={params.course_id} />
        </aside>
      </div>
    </Protect>
  );
}
