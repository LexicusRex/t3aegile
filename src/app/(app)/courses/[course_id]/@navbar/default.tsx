import { NavMenuBar } from "@/components/nav-menu-bar";

const links = [
  {
    title: "Home",
    href: "",
    description: "Start here to get an overview of this course.",
  },
  {
    title: "Tutorials",
    href: "tutorials",
    description:
      "Get ready to explore all the amazing classes we have lined up for you!",
  },
  {
    title: "Participants",
    href: "participants",
    description: "Meet your fellow course participants and start networking!",
  },
  {
    title: "Assignments",
    href: "assignments",
    description:
      "Challenge yourself with our engaging and thought-provoking assignments!",
  },
  {
    title: "Grades",
    href: "grades",
    description: "Check out your progress and celebrate your achievements!",
  },
  {
    title: "Settings",
    href: "settings",
    description:
      "Customize your course experience to suit your learning style!",
  },
];

interface DefaultNavbarProps {
  params: {
    course_id: string;
  };
}

export default function DefaultNavbar({ params }: DefaultNavbarProps) {
  const { course_id } = params;
  return <NavMenuBar route="courses" page_id={course_id} links={links} />;
}
