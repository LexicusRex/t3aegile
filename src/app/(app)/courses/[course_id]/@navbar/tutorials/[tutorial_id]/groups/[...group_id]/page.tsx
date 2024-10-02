import { NavMenuBar } from "@/components/nav-menu-bar";

const links = [
  {
    title: "Home",
    href: "",
    description: "Start here to get an overview of this tutorial.",
    icon: "home",
  },
  {
    title: "Taskboard",
    href: "taskboard",
    description: "Access the tutorial's project groups for each assignment.",
    icon: "kanban",
  },
  {
    title: "Members",
    href: "members",
    description: "View and manage tutorial members.",
    icon: "users",
  },
  {
    title: "Metrics",
    href: "Metrics",
    description: "View and manage tutorial members.",
    icon: "chart",
  },
  {
    title: "Settings",
    href: "settings",
    description: "Customize this tutorial.",
    icon: "settings",
  },
];

interface GroupNavbarProps {
  params: {
    course_id: string;
    tutorial_id: string;
    group_id: string;
  };
}

export default function GroupNavbar({ params }: GroupNavbarProps) {
  const { course_id, tutorial_id, group_id } = params;

  // TODO - add permission to links + filter through for the current user's course role to selectively show links

  return (
    <NavMenuBar
      route={`courses/${course_id}/tutorials/${tutorial_id}/groups`}
      page_id={group_id}
      links={links}
    />
  );
}
