// /app/courses/[course_id]/tutorials/[tutorial_id]/page.tsx
interface TutorialPageProps {
  params: {
    course_id: string;
    tutorial_id: string;
  };
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  return (
    <div>
      Tutorial Content for {params.tutorial_id} in Course {params.course_id}
    </div>
  );
}
