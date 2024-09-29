"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format, isSameDay } from "date-fns";
import { Check, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/fancy-data-table/data-table-column-header";
import {
  isArrayOfDates,
  isArrayOfNumbers,
} from "@/components/fancy-data-table/utils";

import { tagsColor } from "./constants";
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
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      const value = row.getValue<string>("url");
      return <div className="max-w-[200px] truncate">{value}</div>;
    },
  },
  {
    accessorKey: "regions",
    header: "Regions",
    cell: ({ row }) => {
      const value = row.getValue<string>("regions");
      if (Array.isArray(value)) {
        return <div className="text-muted-foreground">{value.join(", ")}</div>;
      }
      return <div className="text-muted-foreground">{`${value}`}</div>;
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
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const value = row.getValue<string | string[]>("tags");
      if (Array.isArray(value)) {
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((v) => (
              <Badge key={v} className={tagsColor[v]?.badge ?? ""}>
                {v}
              </Badge>
            ))}
          </div>
        );
      }
      return <Badge className={tagsColor[value]?.badge ?? ""}>{value}</Badge>;
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
    accessorKey: "p95",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="P95" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<number>("p95");
      if (typeof value === "undefined") {
        return <Minus className="h-4 w-4 text-muted-foreground/50" />;
      }
      return (
        <div>
          <span className="font-mono">{`${value}`}</span> ms
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue<number>(id);
      if (typeof value === "number") return value === Number(rowValue);
      if (Array.isArray(value) && isArrayOfNumbers(value)) {
        const sorted = value.sort((a, b) => a - b) as [number, number];
        return sorted[0] <= rowValue && rowValue <= sorted[1];
      }
      return false;
    },
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      const value = row.getValue("active");
      if (value) return <Check className="h-4 w-4" />;
      return <Minus className="h-4 w-4 text-muted-foreground/50" />;
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);
      if (typeof value === "string") return value === String(rowValue);
      if (typeof value === "boolean") return value === rowValue;
      if (Array.isArray(value)) return value.includes(rowValue);
      return false;
    },
  },
  {
    accessorKey: "public",
    header: "Public",
    cell: ({ row }) => {
      const value = row.getValue("public");
      if (value) return <Check className="h-4 w-4" />;
      return <Minus className="h-4 w-4 text-muted-foreground/50" />;
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);
      if (typeof value === "string") return value === String(rowValue);
      if (typeof value === "boolean") return value === rowValue;
      if (Array.isArray(value)) return value.includes(rowValue);
      return false;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("date");
      return (
        <div className="text-xs text-muted-foreground">
          {format(new Date(`${value}`), "LLL dd, y HH:mm")}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);
      if (value instanceof Date && rowValue instanceof Date) {
        return isSameDay(value, rowValue);
      }
      if (Array.isArray(value)) {
        if (isArrayOfDates(value) && rowValue instanceof Date) {
          const sorted = value.sort((a, b) => a.getTime() - b.getTime()) as [
            Date,
            Date,
          ];
          return (
            sorted[0].getTime() <= rowValue.getTime() &&
            rowValue.getTime() <= sorted[1].getTime()
          );
        }
      }
      return false;
    },
  },
];
