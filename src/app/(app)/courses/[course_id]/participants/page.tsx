import { Suspense } from "react";

import {
  getCourseEnrollable,
  getCourseEnrolments,
} from "@/server/api/crud/course-enrolments/queries";

import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/data-table/skeleton";

import { EnrolParticipantsDialog } from "./_components/enrol-participants-dialog";
import CourseParticipantsTable from "./_components/participants-table";

export const metadata = {
  title: "Participants - ",
};

interface CoursePageProps {
  params: {
    course_id: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { enrollable } = await getCourseEnrollable(params.course_id);
  const { participants } = await getCourseEnrolments(params.course_id);
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
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={5}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
            shrinkZero
          />
        }
      >
        <CourseParticipantsTable
          members={participants}
          candidates={enrollable}
        />
      </Suspense>
      {/* <EnrolParticipantsDialog
        courseId={params.course_id}
        enrollableUsers={enrollable}
      />
      {participants.map((participant) => (
        <p key={participant.id}>{participant.name}</p>
      ))} */}
    </>
  );
}
