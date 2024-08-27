"use client";

import type { CourseParticipant } from "@/server/api/crud/course-enrolments/types";
import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/table-header";

import { DataTableRowActions } from "./participants-table-row-actions";

export function getColumns(
  hasRowActionPermission = false,
): ColumnDef<CourseParticipant>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[20px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CourseMember" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[240px] truncate font-medium">
          {row.getValue("name")}
        </div>
      ),
      filterFn: (row, id, value: string[]) => {
        return value.some((letter: string) => {
          const rowValue = row.getValue<string>(id);
          rowValue.toLowerCase().startsWith(letter.toLowerCase());
        });
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[250px] truncate font-medium">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        // const role = roles.find((role) => role.value === row.getValue("role"));

        // if (!role) {
        //   return null;
        // }

        return (
          <div className="flex w-[100px] items-center">
            {row.getValue("role")}
            {/* {role.icon && (
              <role.icon className="mr-1 h-4 w-4 text-muted-foreground" />
            )}
            <span>{role.label}</span> */}
          </div>
        );
      },
      filterFn: (row, id, value: string[]) => {
        return value.includes(row.getValue<string>(id));
      },
    },
    ...(hasRowActionPermission
      ? [
          {
            id: "actions",
            cell: ({ row }) => <DataTableRowActions row={row} />,
          } as ColumnDef<CourseParticipant>,
        ]
      : []),
  ];
}
