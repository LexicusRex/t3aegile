import {
  ArchiveIcon,
  BarChart3Icon,
  CalendarRangeIcon,
  FileBarChart2Icon,
  GraduationCapIcon,
  HomeIcon,
  KanbanSquareIcon,
  ListTodoIcon,
  MessagesSquareIcon,
  // Package2Icon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import type { SidebarLink } from "@/components/sidebar-items";

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/courses", title: "Courses", icon: GraduationCapIcon },
  { href: "/projects", title: "Projects", icon: KanbanSquareIcon },
  { href: "/tasks", title: "Tasks", icon: ListTodoIcon },
  { href: "/schedule", title: "Schedule", icon: CalendarRangeIcon },
  { href: "/archive", title: "Archive", icon: ArchiveIcon },
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: "Analytics",
    links: [
      {
        href: "/performance",
        title: "Performance",
        icon: BarChart3Icon,
      },
      {
        href: "/reports",
        title: "Reports",
        icon: FileBarChart2Icon,
      },
      {
        href: "/forums",
        title: "Forums",
        icon: MessagesSquareIcon,
      },
    ],
  },
];

export const footerLinks: SidebarLink[] = [
  { href: "/account", title: "Account", icon: UserIcon },
  { href: "/settings", title: "Settings", icon: SettingsIcon },
];
