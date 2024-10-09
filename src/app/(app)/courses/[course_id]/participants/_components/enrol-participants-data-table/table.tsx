import React, { useTransition } from "react";
import { useRouter } from "next/navigation";

import { createCourseEnrolmentAction } from "@/server/actions/courseEnrolments";
import { toast } from "sonner";

import { useDataTable } from "@/hooks/use-fancy-data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/fancy-data-table/data-table";

import { columns } from "./columns";
import { columnFilterSchema, type ColumnSchema } from "./schema";

export function EnrollableParticipantsDataTable({
  courseId,
  enrollables,
}: {
  courseId: string;
  enrollables: ColumnSchema[];
}) {
  const router = useRouter();
  const [pending, startMutation] = useTransition();

  const { table } = useDataTable({
    columns,
    data: enrollables,
  });

  async function enrolUsers(userIds: string[]) {
    console.log("Enrolling user", userIds);
    startMutation(async () => {
      const error = await createCourseEnrolmentAction({ courseId, userIds });
      const failed = Boolean(error);
      if (failed) {
        toast.error(`Failed to create`, {
          description: error ?? "Error",
        });
      } else {
        toast.success(`User enrolled!`);
        router.refresh();
        table.resetRowSelection();
      }
    });
  }
  return (
    <DataTable
      table={table}
      columns={columns}
      columnFilterSchema={columnFilterSchema}
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
              <h3 className="mb-2 text-sm">Enrol Course Participants</h3>
              <p className="my-2 text-xs text-muted-foreground">
                Bulk enrol selected users into the course.
              </p>
              <Button
                size="xs"
                className="w-full text-xs"
                disabled={pending}
                onClick={() =>
                  enrolUsers(
                    table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original.id),
                  )
                }
              >
                Enrol
                {pending
                  ? "ling"
                  : ` ${table.getFilteredSelectedRowModel().rows.length}`}{" "}
                new user(s)
              </Button>
            </div>
          </>
        )}
      </div>
    </DataTable>
  );
}
