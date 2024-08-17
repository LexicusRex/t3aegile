import TutorialNavbar from "../page";

interface GroupsNavbarProps {
  params: {
    course_id: string;
    tutorial_id: string;
  };
}

export default function GroupsNavbar({ params }: GroupsNavbarProps) {
  return <TutorialNavbar params={params} />;
}
