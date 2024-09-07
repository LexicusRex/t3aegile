"use client";

import React from "react";

import type {
  CourseEnrollable,
  CourseParticipant,
} from "@/server/api/crud/course-enrolments/types";

import type { DataTableFilterField } from "@/lib/types";
import { capitalize } from "@/lib/utils";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/toolbar";

import { getColumns } from "./columns";
import { MembersTableToolbarActions } from "./participants-table-toolbar-actions";

interface MembersTableProps {
  members: CourseParticipant[];
  candidates: CourseEnrollable[];
  hasRowActionPermission: boolean;
  hasToolbarActionPermission: boolean;
  roles?: { id: string; name: string }[];
}

export default function CourseParticipantsTable({
  members,
  candidates,
  hasRowActionPermission,
  hasToolbarActionPermission,
  roles = [],
}: MembersTableProps) {
  const columns = React.useMemo(
    () => getColumns(hasRowActionPermission),
    [hasRowActionPermission],
  );
  const filterFields: DataTableFilterField<CourseParticipant>[] = [
    {
      label: "Email",
      value: "email",
      placeholder: "Filter email...",
    },
    {
      label: "Roles",
      value: "role",
      options: roles.map((role) => ({
        label: capitalize(role.name),
        value: role.name,
        withCount: true,
      })),
    },
  ];

  const { table } = useDataTable({ data: members, columns });
  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        {hasToolbarActionPermission && (
          <MembersTableToolbarActions
            table={table}
            enrollableUsers={candidates}
          />
        )}
      </DataTableToolbar>
    </DataTable>
  );
}
