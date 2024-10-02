"use client";

import { cn, stringToNumber } from "@/lib/utils";
import type {
  DataTableFilterField,
  Option,
} from "@/components/fancy-data-table/types";

import { type ColumnSchema } from "./schema";

export const tutColor = {
  0: {
    // red
    badge:
      "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20 hover:bg-[#ef4444]/10",
    dot: "bg-[#ef4444]",
  },
  1: {
    // orange
    badge:
      "text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20 hover:bg-[#f97316]/10",
    dot: "bg-[#f97316]",
  },
  2: {
    // yellow
    badge:
      "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20 hover:bg-[#eab308]/10",
    dot: "bg-[#eab308]",
  },
  3: {
    // green
    badge:
      "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20 hover:bg-[#10b981]/10",
    dot: "bg-[#10b981]",
  },
  4: {
    // blue
    badge:
      "text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/10",
    dot: "bg-[#0ea5e9]",
  },
  5: {
    // indigo
    badge:
      "text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/20 hover:bg-[#6366f1]/10",
    dot: "bg-[#6366f1]",
  },
  6: {
    // violet
    badge:
      "text-[#a855f7] bg-[#a855f7]/10 border-[#a855f7]/20 hover:bg-[#a855f7]/10",
    dot: "bg-[#a855f7]",
  },
  7: {
    // pink
    badge:
      "text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20 hover:bg-[#ec4899]/10",
    dot: "bg-[#ec4899]",
  },
  8: {
    // cool gray
    badge:
      "text-[#64748b] bg-[#64748b]/10 border-[#64748b]/20 hover:bg-[#64748b]/10",
    dot: "bg-[#64748b]",
  },
  9: {
    // warm beige
    badge:
      "text-[#d4a276] bg-[#d4a276]/10 border-[#d4a276]/20 hover:bg-[#d4a276]/10",
    dot: "bg-[#d4a276]",
  },
} as Record<string, Record<"badge" | "dot", string>>;

export function extractUniqueValues(data: ColumnSchema[]) {
  const tuts = new Set<string>();
  const roles = new Set<string>();

  data.forEach((item: ColumnSchema) => {
    if (item.role) {
      roles.add(item.role);
    }
    if (item.tutorials) {
      item.tutorials.forEach((tutorial) => tuts.add(tutorial));
    }
  });

  return {
    ROLES: Array.from(roles),
    TUTORIALS: Array.from(tuts),
  };
}

export function generateFilterFields(
  data: ColumnSchema[],
): DataTableFilterField<ColumnSchema>[] {
  const { ROLES, TUTORIALS } = extractUniqueValues(data);

  const filterFields: DataTableFilterField<ColumnSchema>[] = [
    {
      label: "Name",
      value: "name",
      type: "input",
      options: data.map(({ name }) => ({
        label: name ?? "-",
        value: name ?? "",
      })),
    },
    {
      label: "Email",
      value: "email",
      type: "input",
      options: data.map(({ email }) => ({ label: email, value: email })),
    },
    {
      label: "Tutorials",
      value: "tutorials",
      type: "checkbox",
      component: (props: Option) => {
        if (typeof props.value === "boolean") return null;
        if (typeof props.value === "undefined") return null;
        return (
          <div className="flex w-full items-center justify-between gap-2">
            <span className="truncate font-normal">{props.value}</span>
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                tutColor[stringToNumber(props.value.toString()) % 10]?.dot ??
                  "",
              )}
            />
          </div>
        );
      },
      options: TUTORIALS.map((tutorial) => ({
        label: tutorial,
        value: tutorial,
      })),
      defaultOpen: true,
    },
    {
      label: "Role",
      value: "role",
      type: "checkbox",
      options: ROLES.map((role) => ({
        label: role,
        value: role,
      })),
    },
  ];

  return filterFields;
}
