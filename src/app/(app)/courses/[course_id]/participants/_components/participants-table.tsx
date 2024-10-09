"use client";

import * as React from "react";

import { bulkDeleteCourseEnrolmentAction } from "@/server/actions/courseEnrolments";
import type {
  CourseEnrollable,
  CourseParticipant,
} from "@/server/api/crud/course-enrolments/types";
import type { Role } from "@/server/db/schema/role";
import type { TutorialCore } from "@/server/db/schema/tutorial";
import { Trash2 } from "lucide-react";

import { useDataTable } from "@/hooks/use-fancy-data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/fancy-data-table/data-table";
import { AlertDeleteDialog } from "@/components/forms/alert-delete-dialog";

import { columns as baseColumns } from "./columns";
import { generateFilterFields } from "./constants";
import { EnrolParticipantsDialog } from "./enrol-participants-dialog";
import { DataTableRowActions } from "./participants-table-row-actions";
import { generateFilterSchema } from "./schema";
import { TutorialMultiSelect } from "./tutorial-enrolment-multiselect";

export default function CourseParticipantsTable({
  courseId,
  participants,
  enrollables,
  tutorials,
  roles,
  canManageCourseEnrolments,
  canManageTutorialEnrolments,
}: {
  courseId: string;
  participants: CourseParticipant[];
  enrollables: CourseEnrollable[];
  tutorials: TutorialCore[];
  roles: Role[];
  canManageCourseEnrolments?: boolean;
  canManageTutorialEnrolments?: boolean;
}) {
  const columns = React.useMemo(() => {
    const baseCols = [...baseColumns];
    if (!canManageCourseEnrolments) return baseCols;

    baseCols.push({
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions row={row} roles={roles} courseId={courseId} />
      ),
    });
    return baseCols;
  }, [roles, courseId, canManageCourseEnrolments]);

  const { table } = useDataTable({
    columns,
    data: participants,
  });

  const columnFilterSchema = generateFilterSchema(participants);
  const filterFields = generateFilterFields(participants);
  return (
    <DataTable
      table={table}
      columns={columns}
      columnFilterSchema={columnFilterSchema}
      filterFields={filterFields}
    >
      {canManageCourseEnrolments && (
        <div className="h-fit w-full rounded-md border bg-card p-5 pt-3">
          <p className="font-medium text-foreground">Actions</p>
          <p className="text-xs text-muted-foreground">
            Permform row actions on selected rows.
          </p>
          <Separator className="my-4" />
          {table.getFilteredSelectedRowModel().rows.length === 0 && (
            <div>
              <h3 className="mb-2 text-sm">Enrol Course Participants</h3>
              <EnrolParticipantsDialog
                courseId={courseId}
                enrollableUsers={enrollables}
              />
            </div>
          )}

          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div>
              {/* Delete Section */}
              <div>
                <h3 className="mb-2 text-sm">Delete Selected Rows</h3>
                <AlertDeleteDialog
                  itemType="participant"
                  trigger={
                    <Button
                      variant="destructive"
                      className="h-8 w-full border-red-500/20 bg-red-500/10 text-xs hover:bg-red-500/20 [&>*]:text-red-600 dark:[&>*]:text-red-400"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      <p>
                        Delete {table.getFilteredSelectedRowModel().rows.length}{" "}
                        row(s)
                      </p>
                    </Button>
                  }
                >
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      const error = await bulkDeleteCourseEnrolmentAction({
                        courseId,
                        userIds: table
                          .getFilteredSelectedRowModel()
                          .rows.map((row) => row.original.id),
                      });
                      if (!error) table.resetRowSelection();
                    }}
                  >
                    Delete
                  </Button>
                </AlertDeleteDialog>
              </div>

              {canManageTutorialEnrolments && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="text-sm">Manage Tutorial Enrolment(s)</h3>
                    <p className="my-2 text-xs text-muted-foreground">
                      Shows <strong>common</strong> tutorials of selected rows.
                      Changes apply to all selected rows.
                    </p>
                    <TutorialMultiSelect
                      courseId={courseId}
                      selectedRows={table.getFilteredSelectedRowModel().rows}
                      allTutorials={tutorials}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </DataTable>
  );
}
