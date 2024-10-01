"use client";

import { useEffect } from "react";

import { Edit, Plus, Trash2 } from "lucide-react";

import { useDataTable } from "@/hooks/use-fancy-data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/fancy-data-table/data-table";

import { columns } from "./_components/columns";
import { generateFilterFields } from "./_components/constants";
import { data } from "./_components/data";
import { generateFilterSchema } from "./_components/schema";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const columnFilterSchema = generateFilterSchema(data);

  const search = columnFilterSchema.safeParse(searchParams);

  const { table } = useDataTable({
    columns,
    data,
    defaultColumnFilters: search.success
      ? Object.entries(search.data).map(([key, value]) => ({
          id: key,
          value,
        }))
      : [],
  });

  if (!search.success) {
    console.log(search.error);
    return null;
  }
  const filterFields = generateFilterFields(data);
  console.log("🚀 ~ filterFields:", filterFields);

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
            <h3 className="mb-2 text-sm">Add New Row</h3>
            <Button className="mt-2 h-8 w-full text-xs">
              <Plus className="mr-1 h-3 w-3" />
              Add New Row
            </Button>
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

            {/* Update Selected Rows Section */}
            <div>
              <h3 className="mb-2 text-sm">Update Selected Rows</h3>
              <div className="space-y-2">
                <Select value="tags">
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={"tags"} value={"tags"}>
                      tags
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Enter new value" className="h-7 text-xs" />
              </div>
              <Button className="mt-2 h-8 w-full text-xs">
                <Edit className="mr-1 h-3 w-3" />
                Update x row(s)
              </Button>
            </div>
          </div>
        )}
      </div>
    </DataTable>
  );
}
