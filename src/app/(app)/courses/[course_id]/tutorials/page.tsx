import { Separator } from "@/components/ui/separator";

import ClassesGrid from "./_components/classes-grid";

export default function TutorialsPage() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold leading-none tracking-tight">
          Course Participants
        </h2>
        <p className="text-sm text-muted-foreground">
          View the participants of this course.
          {/* The overview for {course?.term} {course?.code} - {course?.name}. */}
        </p>
      </div>
      <Separator className="my-6" />
      <div className="grid flex-grow grid-cols-1 gap-6 tabular-nums xl:grid-cols-3">
        <ClassesGrid />
        <div className="border border-cyan-500"></div>
      </div>
    </>
  );
}
