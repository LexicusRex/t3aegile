"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { stringToNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/fancy-data-table/data-table-column-header";

import { tutColor } from "./filters";
import type { ColumnSchema } from "./schema";

export const columns: ColumnDef<ColumnSchema>[] = [
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
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="User ID" />
  //   ),
  // },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const value = row.getValue<string>("email");
      return <div className="max-w-[200px] truncate">{value}</div>;
    },
  },
  {
    accessorKey: "tutorials",
    header: "Tutorials",
    cell: ({ row }) => {
      const value = row.getValue<string | string[]>("tutorials");
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((v) => (
              <Badge
                key={v}
                className={tutColor[stringToNumber(v) % 10]?.badge ?? ""}
              >
                {v} {stringToNumber(v)}
              </Badge>
            ))}
          </div>
        );
      }
      return (
        <Badge className={tutColor[stringToNumber(value) % 10]?.badge ?? ""}>
          {value}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const array = row.getValue<string[]>(id);
      if (typeof value === "string") return array.includes(value);
      // up to the user to define either `.some` or `.every`
      if (Array.isArray(value))
        return value.some((i: string) => array.includes(i));
      return false;
    },
  },
  {
    accessorKey: "group",
    header: "Team",
    cell: ({ row }) => {
      const value = row.getValue<string>("group");
      return value ? (
        <Badge className={tutColor[stringToNumber(value) % 10]?.badge ?? ""}>
          {value}
        </Badge>
      ) : null;
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue<string>(id);
      if (typeof value === "string") return value === rowValue;
      if (Array.isArray(value)) return value.includes(rowValue);
      return false;
    },
  },
];
