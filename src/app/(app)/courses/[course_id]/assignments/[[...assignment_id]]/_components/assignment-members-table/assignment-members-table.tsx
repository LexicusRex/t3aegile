"use client";

import * as React from "react";

import {
  bulkGroupEnrolmentAction,
  bulkGroupUnenrolmentAction,
} from "@/server/actions/groups";
import type {
  CourseEnrollable,
  CourseParticipant,
} from "@/server/api/crud/course-enrolments/types";
import { Group } from "@/server/db/schema/group";
import type { Role } from "@/server/db/schema/role";
import type { TutorialCore } from "@/server/db/schema/tutorial";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useDataTable } from "@/hooks/use-fancy-data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/fancy-data-table/data-table";
import { DataTableMultiSelect } from "@/components/fancy-data-table/data-table-multi-select";

import { columns as baseColumns } from "./columns";
import { generateFilterFields } from "./filters";
// import { EnrolParticipantsDialog } from "./enrol-participants-dialog";
// import { DataTableRowActions } from "./participants-table-row-actions";
import { generateFilterSchema, type ColumnSchema } from "./schema";

// import { TutorialMultiSelect } from "./tutorial-enrolment-multiselect";

export default function AssignmentMembersDataTable({
  courseId,
  assignmentId,
  members,
  groups,
  canManageCourseEnrolments,
  canManageTutorialEnrolments,
}: {
  courseId: string;
  assignmentId: string;
  members: ColumnSchema[];
  groups: Group[];
  canManageCourseEnrolments?: boolean;
  canManageTutorialEnrolments?: boolean;
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
    data: members,
  });

  const columnFilterSchema = generateFilterSchema(members);
  const filterFields = generateFilterFields(members);
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
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-sm">Manage Team Enrolment(s)</h3>
              <p className="my-2 text-xs text-muted-foreground">
                Shows <strong>common</strong> teams of selected rows. Changes
                apply to all selected rows.
              </p>
              <DataTableMultiSelect
                selectedRows={table.getFilteredSelectedRowModel().rows}
                allItems={groups}
                getItemsFromRow={(row) => {
                  const val = row.getValue<string | null>("group");
                  return val ? [val] : [];
                }}
                onUpdate={async (added, removed, rows) => {
                  await bulkGroupUnenrolmentAction({
                    courseId,
                    assignmentId,
                    groupId: removed[0] ?? "",
                    userIds: rows.map((row) => row.original.userId),
                  });
                  const enrolError = await bulkGroupEnrolmentAction({
                    courseId,
                    assignmentId,
                    groupId: added[0] ?? "",
                    userIds: rows.map((row) => row.original.userId),
                  });
                  enrolError
                    ? toast.error(enrolError)
                    : toast.success("Enrolled");

                  return Promise.resolve();
                }}
                isSingleSelect
              />
            </div>
          </>
        )}
      </div>
    </DataTable>
  );
}
