import TutorialNavbar from "../page";

interface TutorialNavbarProps {
  params: {
    course_id: string;
    tutorial_id: string;
  };
}

export default function TutorialSettingsNavbar({
  params,
}: TutorialNavbarProps) {
  return <TutorialNavbar params={params} />;
}
