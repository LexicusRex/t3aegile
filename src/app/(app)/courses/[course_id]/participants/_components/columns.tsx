// "use client";

// import Link from "next/link";

// import type { CourseParticipant } from "@/server/api/crud/course-enrolments/types";
// import type { ColumnDef } from "@tanstack/react-table";

// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import { DataTableColumnHeader } from "@/components/data-table/table-header";

// import { DataTableRowActions } from "./participants-table-row-actions";

// export function getColumns(
//   hasRowActionPermission = false,
// ): ColumnDef<CourseParticipant>[] {
//   return [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//           className="translate-y-[2px]"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//           className="translate-y-[20px]"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "id",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="UserID" />
//       ),
//       cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "name",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Name" />
//       ),
//       cell: ({ row }) => (
//         <div className="max-w-[240px] truncate font-medium">
//           {row.getValue("name")}
//         </div>
//       ),
//       filterFn: (row, id, value: string[]) => {
//         return value.some((letter: string) => {
//           const rowValue = row.getValue<string>(id);
//           rowValue.toLowerCase().startsWith(letter.toLowerCase());
//         });
//       },
//     },
//     {
//       accessorKey: "email",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Email" />
//       ),
//       cell: ({ row }) => (
//         <div className="max-w-[250px] truncate font-medium">
//           {row.getValue("email")}
//         </div>
//       ),
//     },
//     {
//       accessorKey: "role",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Role" />
//       ),
//       cell: ({ row }) => {
//         // const role = roles.find((role) => role.value === row.getValue("role"));

//         // if (!role) {
//         //   return null;
//         // }

//         return (
//           <div className="flex w-[100px] items-center">
//             {row.getValue("role")}
//             {/* {role.icon && (
//               <role.icon className="mr-1 h-4 w-4 text-muted-foreground" />
//             )}
//             <span>{role.label}</span> */}
//           </div>
//         );
//       },
//       filterFn: (row, id, value: string[]) => {
//         return value.includes(row.getValue<string>(id));
//       },
//     },
//     {
//       accessorKey: "tutorials",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Tutorials" />
//       ),
//       cell: ({ row }) => {
//         // const role = roles.find((role) => role.value === row.getValue("role"));

//         // if (!role) {
//         //   return null;
//         // }

//         const tutorials: { id: string; name: string }[] =
//           row.getValue("tutorials");
//         return (
//           <div className="flex w-[100px] items-center gap-x-2">
//             {tutorials.map((tutorial) => (
//               <Badge key={tutorial.id} variant="secondary">
//                 <Link href={`tutorials/${tutorial.id}`} className="underline">
//                   {tutorial.name}
//                 </Link>
//               </Badge>
//             ))}
//             {/* {role.icon && (
//               <role.icon className="mr-1 h-4 w-4 text-muted-foreground" />
//             )}
//             <span>{role.label}</span> */}
//           </div>
//         );
//       },
//       filterFn: (row, id, value: string[]) => {
//         const tutorialIds = row
//           .getValue<{ id: string; name: string }[]>(id)
//           .map((tutorial) => tutorial.id);
//         // console.log("🚀 ~ row:", row);
//         // console.log("🚀 ~ id:", id);
//         // console.log("🚀 ~ value:", value);
//         // console.log("🚀 ~ getValue:", row.getValue(id));
//         // return value.includes(row.getValue<string>(id));
//         return value.some((tutorialId) => tutorialIds.includes(tutorialId));
//       },
//     },
//     ...(hasRowActionPermission
//       ? [
//           {
//             id: "actions",
//             cell: ({ row }) => <DataTableRowActions row={row} />,
//           } as ColumnDef<CourseParticipant>,
//         ]
//       : []),
//   ];
// }

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format, isSameDay } from "date-fns";
import { Check, Minus } from "lucide-react";

import { stringToNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/fancy-data-table/data-table-column-header";
import {
  isArrayOfDates,
  isArrayOfNumbers,
} from "@/components/fancy-data-table/utils";

import { tutColor } from "./constants";
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const value = row.getValue<string>("role");
      return <div className="max-w-[200px] truncate">{value}</div>;
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue<string>(id);
      if (typeof value === "string") return value === rowValue;
      if (Array.isArray(value)) return value.includes(rowValue);
      return false;
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
];
