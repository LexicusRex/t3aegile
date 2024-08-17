import type { Metadata } from "next";

import { Separator } from "@/components/ui/separator";
import Protect from "@/components/protect";
import { SettingsNav } from "@/components/settings-nav";

export const metadata: Metadata = {
  title: "Course Settings",
};

interface CourseSettingsLayoutProps {
  params: { course_id: string };
  children: React.ReactNode;
}

export default function CourseSettingsLayout({
  params,
  children,
}: CourseSettingsLayoutProps) {
  const settingsNavItems = [
    {
      title: "General",
      href: `/courses/${params.course_id}/settings`,
    },
    {
      title: "Roles & Permissions",
      href: `/courses/${params.course_id}/settings/roles`,
    },
    {
      title: "Preferences",
      href: `/courses/${params.course_id}/settings/preferences`,
    },
    {
      title: "Advanced",
      href: `/courses/${params.course_id}/settings/advanced`,
    },
  ];
  return (
    <Protect courseId={params.course_id} permissionSlug="course:edit">
      <div className="space-y-2">
        <h2 className="font-semibold leading-none tracking-tight">
          Course Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage settings and preferences related to this course.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="sticky top-16 -mx-4 self-start lg:w-1/5">
          <SettingsNav items={settingsNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </Protect>
  );
}
