import { Separator } from "@/components/ui/separator";
import Protect from "@/components/protect";

interface CoursePageProps {
  params: {
    course_id: string;
  };
}

export default async function CourseSettingsPage({ params }: CoursePageProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold leading-none tracking-tight">General</h3>
        <p className="text-sm text-muted-foreground">
          Edit general information about your course.
        </p>
      </div>
      <Separator />
      {/* <CourseInfoForm initialData={courseData} courseId={params.course_id} /> */}
    </div>
  );
}
