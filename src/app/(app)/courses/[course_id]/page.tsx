interface CoursePageProps {
  params: {
    course_id: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  return <div>Course Content for {params.course_id}</div>;
}
