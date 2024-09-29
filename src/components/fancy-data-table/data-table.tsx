"use client";

import * as React from "react";

import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table as TTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  columnFilterSchema: TSchema;
  defaultColumnFilters?: ColumnFiltersState;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTable<TData, TValue, TSchema extends z.AnyZodObject>({
  columns,
  data,
  columnFilterSchema,
  defaultColumnFilters = [],
  filterFields = [],
}: DataTableProps<TData, TValue, TSchema>) {
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(defaultColumnFilters);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>("data-table-visibility", {});
  const [controlsOpen, setControlsOpen] = useLocalStorage(
    "data-table-controls",
    true,
  );

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: (table: TTable<TData>, columnId: string) => () => {
      const map = getFacetedUniqueValues<TData>()(table, columnId)();
      const rowValues: unknown[] = table
        .getGlobalFacetedRowModel()
        .flatRows.map((row) => row.getValue(columnId));

      for (const values of rowValues) {
        if (Array.isArray(values)) {
          for (const value of values) {
            const prevValue = map.get(value) ?? 0;
            map.set(value, prevValue + 1);
          }
        } else {
          const prevValue = map.get(values) ?? 0;
          map.set(values, prevValue + 1);
        }
      }
      return map;
      // const map = getFacetedUniqueValues<TData>()(table, columnId)();
      // // TODO: it would be great to do it dynamically, if we recognize the row to be Array.isArray
      // if (["regions", "tags"].includes(columnId)) {
      //   const rowValues: string[] = table
      //     .getGlobalFacetedRowModel()
      //     .flatRows.map((row) => row.getValue(columnId));
      //   for (const values of rowValues) {
      //     for (const value of values) {
      //       const prevValue = map.get(value) ?? 0;
      //       map.set(value, prevValue + 1);
      //     }
      //   }
      // }
      // return map;
    },
  });

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      <div
        className={cn(
          "w-full p-1 sm:sticky sm:top-0 sm:h-screen sm:min-w-52 sm:max-w-52 sm:self-start md:min-w-64 md:max-w-64 lg:min-w-72 lg:max-w-72",
          !controlsOpen && "hidden",
        )}
      >
        <div className="-m-1 h-full p-1 sm:overflow-x-hidden sm:overflow-y-scroll">
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
        <div className="rounded-md border">
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
