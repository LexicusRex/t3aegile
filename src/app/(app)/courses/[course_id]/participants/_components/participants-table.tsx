"use client";

import React from "react";

import type {
  CourseEnrollable,
  CourseParticipant,
} from "@/server/api/crud/course-enrolments/types";
import { ShieldCheckIcon, UserIcon, UserPlusIcon } from "lucide-react";

import type { DataTableFilterField } from "@/lib/types";
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
}

const roles = [
  {
    value: "admin",
    label: "Admin",
    icon: ShieldCheckIcon,
  },
  {
    value: "tutor",
    label: "Tutor",
    icon: UserPlusIcon,
  },
  {
    value: "student",
    label: "Student",
    icon: UserIcon,
  },
];

export default function CourseParticipantsTable({
  members,
  candidates,
  hasRowActionPermission,
  hasToolbarActionPermission,
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
        ...role,
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
