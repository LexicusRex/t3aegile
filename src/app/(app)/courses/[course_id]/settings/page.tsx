import { Suspense } from "react";

import { getCourseById } from "@/server/api/crud/courses/queries";

import { Separator } from "@/components/ui/separator";
import Protect from "@/components/protect";
import Loading from "@/app/(app)/loading";

import CourseForm from "../../_components/course-form";

interface CoursePageProps {
  params: {
    course_id: string;
  };
}

export default async function CourseSettingsPage({ params }: CoursePageProps) {
  const { course } = await getCourseById(params.course_id);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold leading-none tracking-tight">General</h3>
        <p className="text-sm text-muted-foreground">
          Edit general information about your course.
        </p>
      </div>
      <Separator />
      <Suspense fallback={<Loading />}>
        <CourseForm course={course} />
      </Suspense>
    </div>
  );
}
