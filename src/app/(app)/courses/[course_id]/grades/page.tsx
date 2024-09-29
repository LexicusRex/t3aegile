"use client";

import { useEffect } from "react";

import { DataTable } from "@/components/fancy-data-table/data-table";

import { columns } from "./_components/columns";
import { data, filterFields } from "./_components/constants";
import { columnFilterSchema } from "./_components/schema";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const search = columnFilterSchema.safeParse(searchParams);

  if (!search.success) {
    console.log(search.error);
    return null;
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      columnFilterSchema={columnFilterSchema}
      filterFields={filterFields}
      defaultColumnFilters={Object.entries(search.data).map(([key, value]) => ({
        id: key,
        value,
      }))}
    />
  );
}
