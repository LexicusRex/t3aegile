import Protect from "@/components/protect";

interface CoursePageProps {
  params: {
    course_id: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  return (
    <Protect courseId={params.course_id} permissionSlug="course:view_external">
      <div>Course Settings for {params.course_id}</div>
    </Protect>
  );
}
