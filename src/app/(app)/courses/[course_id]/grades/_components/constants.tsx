"use client";

import { cn } from "@/lib/utils";
import type {
  DataTableFilterField,
  Option,
} from "@/components/fancy-data-table/types";

import { type ColumnSchema } from "./schema";

export const tagsColor = {
  api: {
    badge:
      "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20 hover:bg-[#10b981]/10",
    dot: "bg-[#10b981]",
  },
  web: {
    badge:
      "text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/10",
    dot: "bg-[#0ea5e9]",
  },
  enterprise: {
    badge:
      "text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20 hover:bg-[#ec4899]/10",
    dot: "bg-[#ec4899]",
  },
  app: {
    badge:
      "text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20 hover:bg-[#f97316]/10",
    dot: "bg-[#f97316]",
  },
} as Record<string, Record<"badge" | "dot", string>>;

// REMINDER: If a field has no enum() but you require to filter through its unique values, use the extractUniqueValues helper function.
// It is a little less cost effective than querying the unique values from the server, but it's less hassle and prop passing.
export function extractUniqueValues(data: ColumnSchema[]) {
  const regions = new Set<string>();
  const tags = new Set<string>();

  data.forEach((item: ColumnSchema) => {
    if (item.regions) {
      item.regions.forEach((region) => regions.add(region));
    }
    if (item.tags) {
      item.tags.forEach((tag) => tags.add(tag));
    }
  });

  return {
    REGIONS: Array.from(regions),
    TAGS: Array.from(tags),
  };
}

export function generateFilterFields(
  data: ColumnSchema[],
): DataTableFilterField<ColumnSchema>[] {
  const { REGIONS, TAGS } = extractUniqueValues(data);

  const filterFields: DataTableFilterField<ColumnSchema>[] = [
    {
      label: "Time Range",
      value: "date",
      type: "timerange",
      defaultOpen: true,
      commandDisabled: true,
    },
    {
      label: "Name",
      value: "name",
      type: "input",
      options: data.map(({ name }) => ({ label: name, value: name })),
    },
    {
      label: "URL",
      value: "url",
      type: "input",
      options: data.map(({ url }) => ({ label: url, value: url })),
    },
    {
      label: "Public",
      value: "public",
      type: "checkbox",
      options: [true, false].map((bool) => ({ label: `${bool}`, value: bool })),
    },
    {
      label: "Active",
      value: "active",
      type: "checkbox",
      options: [true, false].map((bool) => ({ label: `${bool}`, value: bool })),
    },
    {
      label: "P95",
      value: "p95",
      type: "slider",
      min: 0,
      max: 3000,
      options: data.map(({ p95 }) => ({ label: `${p95}`, value: p95 })),
      defaultOpen: true,
    },
    {
      label: "Regions",
      value: "regions",
      type: "checkbox",
      options: REGIONS.map((region) => ({ label: region, value: region })),
    },
    {
      label: "Tags",
      value: "tags",
      type: "checkbox",
      defaultOpen: true,
      // REMINDER: "use client" needs to be declared in the file - otherwise getting serialization error from Server Component
      component: (props: Option) => {
        if (typeof props.value === "boolean") return null;
        if (typeof props.value === "undefined") return null;
        return (
          <div className="flex w-full items-center justify-between gap-2">
            <span className="truncate font-normal">{props.value}</span>
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                tagsColor[props.value]?.dot ?? "",
              )}
            />
          </div>
        );
      },
      options: TAGS.map((tag) => ({ label: tag, value: tag })),
    },
  ];

  return filterFields;
}
