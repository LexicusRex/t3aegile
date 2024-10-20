"use client";

import type React from "react";

// import { useRouter } from "next/navigation";

import type { ColumnDef, Table } from "@tanstack/react-table";
import { X } from "lucide-react";

// import useUpdateSearchParams from "@/hooks/use-update-search-params";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { DataTableFilterCheckbox } from "./data-table-filter-checkbox";
import { DataTableFilterInput } from "./data-table-filter-input";
import { DataTableFilterResetButton } from "./data-table-filter-reset-button";
import { DataTableFilterSlider } from "./data-table-filter-slider";
import { DataTableFilterTimerange } from "./data-table-filter-timerange";
import type { DataTableFilterField } from "./types";

// TODO: only pass the columns to generate the filters!
// https://tanstack.com/table/v8/docs/framework/react/examples/filters
interface DataTableFilterControlsProps<TData, TValue> {
  table: Table<TData>;
  columns: ColumnDef<TData, TValue>[];
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableFilterControls<TData, TValue>({
  table,
  columns,
  filterFields,
}: DataTableFilterControlsProps<TData, TValue>) {
  const filters = table.getState().columnFilters;
  // const updateSearchParams = useUpdateSearchParams();
  // const router = useRouter();

  // const updatePageSearchParams = (values: Record<string, string | null>) => {
  //   const newSearchParams = updateSearchParams(values);
  //   router.replace(`?${newSearchParams}`, { scroll: false });
  // };

  return (
    <div className="flex flex-col gap-2 rounded-md border bg-card p-5 pt-3">
      <div className="relative flex h-fit items-center justify-between gap-3">
        <div>
          <p className="mb-1 font-medium text-foreground">Filters</p>
          <p className="text-xs text-muted-foreground">
            Permform row actions on selected rows.
          </p>
          <Separator className="my-4" />
        </div>
        <div className="absolute right-0 top-0">
          {filters.length ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 p-2 text-xs"
              onClick={() => {
                table.resetColumnFilters();
                // const resetValues = filters.reduce<Record<string, null>>(
                //   (prev, curr) => {
                //     prev[curr.id] = null;
                //     return prev;
                //   },
                //   {},
                // );
                // updatePageSearchParams(resetValues);
              }}
            >
              <X className="mr-[2px] h-3 w-3" />
              Reset
            </Button>
          ) : null}
        </div>
      </div>
      <Accordion
        type="multiple"
        // REMINDER: open all filters by default
        defaultValue={filterFields
          ?.filter(({ defaultOpen }) => defaultOpen)
          ?.map(({ value }) => value as string)}
      >
        {filterFields?.map((field) => {
          return (
            <AccordionItem
              key={field.value as string}
              value={field.value as string}
              className="border-none"
            >
              <AccordionTrigger className="p-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {field.label}
                  </p>
                  <DataTableFilterResetButton table={table} {...field} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="-mx-2 mt-0 px-3 pt-3">
                {/* if field.options is empty */}
                {field.options?.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    No options available...
                  </p>
                )}
                {(() => {
                  switch (field.type) {
                    case "checkbox": {
                      return (
                        <DataTableFilterCheckbox table={table} {...field} />
                      );
                    }
                    case "slider": {
                      return <DataTableFilterSlider table={table} {...field} />;
                    }
                    case "input": {
                      return <DataTableFilterInput table={table} {...field} />;
                    }
                    case "timerange": {
                      return (
                        <DataTableFilterTimerange table={table} {...field} />
                      );
                    }
                  }
                })()}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
