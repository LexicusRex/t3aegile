// "use client";

// import React from "react";

// import type {
//   CourseEnrollable,
//   CourseParticipant,
// } from "@/server/api/crud/course-enrolments/types";
// import type { TutorialCore } from "@/server/db/schema/tutorial";

// import type { DataTableFilterField } from "@/lib/types";
// import { capitalize } from "@/lib/utils";
// import { useDataTable } from "@/hooks/use-data-table";
// import { DataTable } from "@/components/data-table/data-table";
// import { DataTableToolbar } from "@/components/data-table/toolbar";

// import { getColumns } from "./columns";
// import { MembersTableToolbarActions } from "./participants-table-toolbar-actions";

// interface MembersTableProps {
//   members: CourseParticipant[];
//   candidates: CourseEnrollable[];
//   tutorials: TutorialCore[];
//   hasRowActionPermission: boolean;
//   hasToolbarActionPermission: boolean;
//   roles?: { id: string; name: string }[];
// }

// export default function CourseParticipantsTable({
//   members,
//   candidates,
//   tutorials,
//   hasRowActionPermission,
//   hasToolbarActionPermission,
//   roles = [],
// }: MembersTableProps) {
//   const columns = React.useMemo(
//     () => getColumns(hasRowActionPermission),
//     [hasRowActionPermission],
//   );
//   const filterFields: DataTableFilterField<CourseParticipant>[] = [
//     {
//       label: "Email",
//       value: "email",
//       placeholder: "Filter email...",
//     },
//     {
//       label: "Roles",
//       value: "role",
//       options: roles.map((role) => ({
//         label: capitalize(role.name),
//         value: role.name,
//         withCount: true,
//       })),
//     },
//     {
//       label: "Tutorials",
//       value: "tutorials",
//       options: tutorials.map((tut) => ({
//         label: capitalize(tut.name),
//         value: tut.id,
//         withCount: true,
//       })),
//     },
//   ];

//   const { table } = useDataTable({ data: members, columns });
//   return (
//     <DataTable table={table}>
//       <DataTableToolbar table={table} filterFields={filterFields}>
//         {hasToolbarActionPermission && (
//           <MembersTableToolbarActions
//             table={table}
//             enrollableUsers={candidates}
//             courseTutorials={tutorials}
//           />
//         )}
//       </DataTableToolbar>
//     </DataTable>
//   );
// }

"use client";

import * as React from "react";

import type {
  CourseEnrollable,
  CourseParticipant,
} from "@/server/api/crud/course-enrolments/types";
import type { Role } from "@/server/db/schema/role";
import type { TutorialCore } from "@/server/db/schema/tutorial";
import { Edit, Plus, Trash2 } from "lucide-react";

import { useDataTable } from "@/hooks/use-fancy-data-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/fancy-data-table/data-table";

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
}: {
  courseId: string;
  participants: CourseParticipant[];
  enrollables: CourseEnrollable[];
  tutorials: TutorialCore[];
  roles: Role[];
}) {
  const columns = React.useMemo(() => {
    return [
      ...baseColumns,
      {
        id: "actions",
        cell: ({ row }) => (
          <DataTableRowActions row={row} roles={roles} courseId={courseId} />
        ),
      },
    ];
  }, [roles, courseId]);

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
            </div>

            <Separator className="my-4" />
            <div>
              <h3 className="mb-2 text-sm">Manage Tutorial Enrolment(s)</h3>
              <TutorialMultiSelect
                courseId={courseId}
                selectedRows={table.getFilteredSelectedRowModel().rows}
                allTutorials={tutorials}
              />
            </div>
          </div>
        )}
      </div>
    </DataTable>
  );
}
