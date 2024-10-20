"use client";

import type { CourseEnrollable } from "@/server/api/crud/course-enrolments/types";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EnrollableParticipantsDataTable } from "./enrol-participants-data-table/table";

export function EnrolParticipantsDialog({
  courseId,
  enrollableUsers,
}: {
  courseId: string;
  enrollableUsers: CourseEnrollable[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="mt-2 w-full text-xs">
          <PlusIcon className="mr-2 h-4 w-4" />
          Enrol Participants
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100%-4rem)] max-w-[calc(100%-8rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enrol Participants</DialogTitle>
          <DialogDescription>
            Enrol existing and verified users to this course.
          </DialogDescription>
        </DialogHeader>

        <EnrollableParticipantsDataTable
          courseId={courseId}
          enrollables={enrollableUsers}
        />
      </DialogContent>
    </Dialog>
  );
}
