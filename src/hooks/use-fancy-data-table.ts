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
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useLocalStorage } from "@/hooks/use-local-storage";

interface UseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultColumnFilters?: ColumnFiltersState;
}

export function useDataTable<TData, TValue>({
  columns,
  data,
  defaultColumnFilters = [],
}: UseDataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(defaultColumnFilters);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    useLocalStorage<VisibilityState>("data-table-visibility", {});

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
    // getFacetedUniqueValues: getFacetedUniqueValues(),
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
          if (!map.has(values)) {
            const prevValue = map.get(values) ?? 0;
            map.set(values, prevValue + 1);
          }
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

  return { table };
}
