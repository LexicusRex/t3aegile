// /app/courses/[course_id]/tutorials/[tutorial_id]/page.tsx
interface GroupPageProps {
  params: {
    course_id: string;
    tutorial_id: string;
    group_id: string;
  };
}

export default async function TutorialPage({ params }: GroupPageProps) {
  return (
    <div>
      Group Content for {params.group_id} in Tutorial {params.tutorial_id} in
      Course {params.course_id}
    </div>
  );
}
