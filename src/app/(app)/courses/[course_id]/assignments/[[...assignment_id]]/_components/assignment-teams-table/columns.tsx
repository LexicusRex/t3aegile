"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { stringToNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/fancy-data-table/data-table-column-header";

import { groupColor } from "./filters";
import type { ColumnSchema } from "./schema";

export const columns: ColumnDef<ColumnSchema>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[20px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="User ID" />
  //   ),
  // },
  {
    accessorKey: "identifier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identifier" />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("name");
      return value ? (
        // <Badge className={groupColor[stringToNumber(value) % 10]?.badge ?? ""}>
        //   {value}
        // </Badge>
        <p
          className={`${
            groupColor[stringToNumber(value) % 10]?.badge ?? ""
          } bg-transparent font-semibold hover:bg-transparent`}
        >
          {value}
        </p>
      ) : null;
    },
    enableHiding: false,
  },
  {
    accessorKey: "users",
    header: "Members",
    cell: ({ row }) => {
      const users = row.getValue<Record<string, string>[]>("users");
      return (
        <div className="max-w-[200px] truncate">
          {users.map((user, index) => (
            <p key={index}>
              {user.name}
              {/* {index < users.length - 1 && ", "} */}
            </p>
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (value === null || value === "" || value === "null") {
        return true; // Return all rows if the input is cleared
      }
      const rowValue = row
        .getValue<Record<string, string>[]>(id)
        .map((user) => user.name?.toLowerCase() ?? "");
      const searchValue = (value as string).toLowerCase();
      return rowValue.some((name) => name.includes(searchValue));
    },
  },
];
