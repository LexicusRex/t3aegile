import DefaultNavbar from "../default";

interface TutorialsNavbarProps {
  params: {
    course_id: string;
  };
}

export default function TutorialsNavbar({ params }: TutorialsNavbarProps) {
  return <DefaultNavbar params={params} />;
}
