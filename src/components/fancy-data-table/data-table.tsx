"use client";

import * as React from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import type { z } from "zod";

import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTableFilterCommand } from "./data-table-filter-command";
import { DataTableFilterControls } from "./data-table-filter-controls";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar"; // TODO: check where to put this

// import { columnFilterSchema } from "./schema";
import type { DataTableFilterField } from "./types";

interface DataTableProps<TData, TValue, TSchema extends z.AnyZodObject> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  columnFilterSchema: TSchema;
  filterFields?: DataTableFilterField<TData>[];
  children?: React.ReactNode;
}

export function DataTable<TData, TValue, TSchema extends z.AnyZodObject>({
  table,
  columns,
  columnFilterSchema,
  filterFields = [],
  children,
}: DataTableProps<TData, TValue, TSchema>) {
  const [controlsOpen, setControlsOpen] = useLocalStorage(
    "data-table-controls",
    true,
  );

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      <div
        className={cn(
          "w-full p-1 sm:sticky sm:top-0 sm:min-w-52 sm:max-w-52 sm:self-start md:min-w-64 md:max-w-64 lg:min-w-72 lg:max-w-72", // removed sm:h-screen
          !controlsOpen && "hidden",
        )}
      >
        <div className="-m-1 h-full space-y-4 p-1 sm:overflow-x-hidden sm:overflow-y-scroll">
          {children}
          <DataTableFilterControls
            table={table}
            columns={columns}
            filterFields={filterFields}
          />
        </div>
      </div>
      <div className="flex max-w-full flex-1 flex-col gap-4 overflow-hidden p-1">
        <DataTableFilterCommand
          table={table}
          schema={columnFilterSchema}
          filterFields={filterFields}
        />
        <DataTableToolbar
          table={table}
          controlsOpen={controlsOpen}
          setControlsOpen={setControlsOpen}
        />
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
