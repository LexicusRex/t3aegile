import { NavMenuBar } from "@/components/nav-menu-bar";

const links = [
  {
    title: "Home",
    href: "",
    description: "Start here to get an overview of this tutorial.",
    icon: "home",
  },
  {
    title: "Groups",
    href: "groups",
    description: "Access the tutorial's project groups for each assignment.",
    icon: "group",
  },
  {
    title: "Members",
    href: "members",
    description: "View and manage tutorial members.",
    icon: "users",
  },
  {
    title: "Settings",
    href: "settings",
    description: "Customize this tutorial.",
    icon: "settings",
  },
];

interface TutorialNavbarProps {
  params: {
    course_id: string;
    tutorial_id: string;
  };
}

export default function TutorialNavbar({ params }: TutorialNavbarProps) {
  const { course_id, tutorial_id } = params;

  // TODO - add permission to links + filter through for the current user's course role to selectively show links

  return (
    <NavMenuBar
      route={`courses/${course_id}/tutorials`}
      page_id={tutorial_id}
      links={links}
    />
  );
}
