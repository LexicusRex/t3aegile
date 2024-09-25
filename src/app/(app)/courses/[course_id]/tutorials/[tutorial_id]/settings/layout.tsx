import type { Metadata } from "next";

import { PERM_TUTORIAL_MANAGE_CORE } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";
import Protect from "@/components/protect";
import { SettingsNav } from "@/components/settings-nav";

export const metadata: Metadata = {
  title: "Course Settings",
};

interface TutorialSettingsLayoutProps {
  params: { course_id: string; tutorial_id: string };
  children: React.ReactNode;
}

export default function TutorialSettingsLayout({
  params,
  children,
}: TutorialSettingsLayoutProps) {
  const settingsNavItems = [
    {
      title: "General",
      href: `/courses/${params.course_id}/tutorials/${params.tutorial_id}/settings`,
      pattern: "/settings/?$",
    },
    // {
    //   title: "Roles & Permissions",
    //   href: `/courses/${params.course_id}/settings/roles`,
    //   pattern: "/settings/roles(/[^/]+)?$",
    // },
    // {
    //   title: "Preferences",
    //   href: `/courses/${params.course_id}/settings/preferences`,
    //   pattern: "/settings/preferences(/[^/]+)?$",
    // },
    // {
    //   title: "Advanced",
    //   href: `/courses/${params.course_id}/settings/advanced`,
    //   pattern: "/settings/advanced(/[^/]+)?$",
    // },
  ];
  return (
    <Protect
      courseId={params.course_id}
      permissionSlug={PERM_TUTORIAL_MANAGE_CORE}
    >
      <div className="space-y-2">
        <h2 className="font-semibold leading-none tracking-tight">
          Tutorial Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage settings and preferences related to this tutorial.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="sticky top-16 -mx-4 self-start lg:w-1/5">
          <SettingsNav items={settingsNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </Protect>
  );
}
