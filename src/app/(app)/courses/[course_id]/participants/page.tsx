import { Suspense } from "react";

import {
  getCourseEnrollable,
  getCourseEnrolments,
} from "@/server/api/crud/course-enrolments/queries";
import { getCourseRoles } from "@/server/api/crud/roles/queries";
import { verifyProtectedPermission } from "@/server/auth";
import { api } from "@/trpc/server";
import { Edit, Plus, Trash2 } from "lucide-react";

import { PERM_COURSE_MANAGE_ENROLMENTS } from "@/lib/constants";
import { useDataTable } from "@/hooks/use-fancy-data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/data-table/skeleton";

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

  const { roles } = await getCourseRoles(params.course_id);

  const { tutorials } = await api.tutorial.getAllByCourseId({
    courseId: params.course_id,
  });

  const { access: hasManageEnrolmentsPermission } =
    await verifyProtectedPermission(
      params.course_id,
      PERM_COURSE_MANAGE_ENROLMENTS,
    );
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
        {/*         
        <CourseParticipantsTable
          members={participants}
          candidates={enrollable}
          tutorials={tutorials}
          hasRowActionPermission={hasManageEnrolmentsPermission}
          hasToolbarActionPermission={hasManageEnrolmentsPermission}
          roles={roles}
        /> */}
        <CourseParticipantsTable participants={participants} />
      </Suspense>
    </>
  );
}
