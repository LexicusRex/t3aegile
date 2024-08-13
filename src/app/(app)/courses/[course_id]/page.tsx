import { getCourseById } from "@/server/api/crud/courses/queries";

import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Course",
};

interface CoursePageProps {
  params: {
    course_id: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { course } = await getCourseById(params.course_id);
  return (
    <>
      <div className="space-y-0.5">
        <h2 className="text-xl font-medium tracking-tight">Course Home</h2>
        <p className="text-sm text-muted-foreground">
          The overview for {course?.term} {course?.code} - {course?.name}.
        </p>
      </div>
      <Separator className="my-6" />
    </>
  );
}
