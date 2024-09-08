"use client";

import { useParams } from "next/navigation";

import type {
  CourseEnrollable,
  CourseParticipant,
} from "@/server/api/crud/course-enrolments/types";
import { type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { EnrolParticipantsDialog } from "./enrol-participants-dialog";

// import { CreateTaskDialog } from "./create-task-dialog";
// import { DeleteTasksDialog } from "./delete-tasks-dialog";

interface MembersTableToolbarActionsProps {
  table: Table<CourseParticipant>;
  enrollableUsers: CourseEnrollable[];
}

export function MembersTableToolbarActions({
  table,
  enrollableUsers = [],
}: MembersTableToolbarActionsProps) {
  const { course_id } = useParams();
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <Button size="sm">Delete</Button>
      ) : null}
      <EnrolParticipantsDialog
        courseId={course_id?.toString() ?? ""}
        enrollableUsers={enrollableUsers}
      />
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
