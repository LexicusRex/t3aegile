import { NavMenuBar } from "@/components/nav-menu-bar";

const links = [
  {
    title: "Home",
    href: "",
    description: "Start here to get an overview of this tutorial.",
  },
  {
    title: "Groups",
    href: "groups",
    description: "Access the tutorial's project groups for each assignment.",
  },
  {
    title: "Members",
    href: "members",
    description: "View and manage tutorial members.",
  },
  {
    title: "Settings",
    href: "settings",
    description: "Customize this tutorial.",
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
