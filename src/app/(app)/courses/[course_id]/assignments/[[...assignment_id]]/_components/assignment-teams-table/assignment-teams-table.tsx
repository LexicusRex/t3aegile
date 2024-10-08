"use client";

import * as React from "react";

import { PlusIcon } from "lucide-react";

import { useDataTable } from "@/hooks/use-fancy-data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/fancy-data-table/data-table";
import { GroupForm } from "@/components/forms/groups/group-form";

import { columns as baseColumns } from "./columns";
import { generateFilterFields } from "./filters";
// import { EnrolParticipantsDialog } from "./enrol-participants-dialog";
// import { DataTableRowActions } from "./participants-table-row-actions";
import { generateFilterSchema, type ColumnSchema } from "./schema";

// import { TutorialMultiSelect } from "./tutorial-enrolment-multiselect";

export default function AssignmentTeamsDataTable({
  courseId,
  assignmentId,
  teams,
}: {
  courseId: string;
  assignmentId: string;
  teams: ColumnSchema[];
}) {
  const columns = baseColumns;

  // React.useMemo(() => {
  //   const baseCols = [...baseColumns];
  //   if (!canManageCourseEnrolments) return baseCols;

  //   baseCols.push({
  //     id: "actions",
  //     cell: ({ row }) => (
  //       <DataTableRowActions row={row} roles={roles} courseId={courseId} />
  //     ),
  //   });
  //   return baseCols;
  // }, [roles, courseId, canManageCourseEnrolments]);

  const { table } = useDataTable({
    columns,
    data: teams,
  });

  const columnFilterSchema = generateFilterSchema(teams);
  const filterFields = generateFilterFields(teams);
  return (
    <DataTable
      table={table}
      columns={columns}
      columnFilterSchema={columnFilterSchema}
      filterFields={filterFields}
    >
      <div className="h-fit w-full rounded-md border bg-card p-5 pt-3">
        <p className="font-medium text-foreground">Actions</p>
        <p className="text-xs text-muted-foreground">
          Permform row actions on selected rows.
        </p>
        <Separator className="my-4" />
        <div>
          <h3 className="mb-2 text-sm">Enrol Course Participants</h3>
          <GroupCreationDialog
            courseId={courseId}
            assignmentId={assignmentId}
          />
        </div>
      </div>
    </DataTable>
  );
}

function GroupCreationDialog({
  courseId,
  assignmentId,
}: {
  courseId: string;
  assignmentId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="xs" className="mt-2 w-full text-xs">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new group</DialogTitle>
          <DialogDescription>
            Intialise a new group with a corresponding identifier for tasks,
          </DialogDescription>
        </DialogHeader>
        <GroupForm courseId={courseId} assignmentId={assignmentId} />
      </DialogContent>
    </Dialog>
  );
}
