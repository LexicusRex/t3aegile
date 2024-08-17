import DefaultNavbar from "./default";

interface BaseNavbarProps {
  params: {
    course_id: string;
  };
}

export default function BaseNavbar({ params }: BaseNavbarProps) {
  return <DefaultNavbar params={params} />;
}
