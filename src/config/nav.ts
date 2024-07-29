import type { SidebarLink } from "@/components/sidebar-items";
import {
  Cog,
  User,
  HomeIcon,
  ArchiveIcon,
  BarChart3Icon,
  CalendarRangeIcon,
  FileBarChart2Icon,
  GraduationCapIcon,
  KanbanSquareIcon,
  ListTodoIcon,
  MessagesSquareIcon,
  Package2Icon,
  SettingsIcon,
} from "lucide-react";
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
  {
    title: "Configuration",
    links: [
      { href: "/account", title: "Account", icon: User },
      { href: "/settings", title: "Settings", icon: Cog },
    ],
  },
];