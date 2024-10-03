"use client";

import React, { useTransition } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  deleteCourseEnrolmentAction,
  updateCourseEnrolmentAction,
} from "@/server/actions/courseEnrolments";
// import AlertDeleteDialog from "@/components/alert-delete-dialog";

// import { roles } from "./data";
import type { CourseParticipant } from "@/server/api/crud/course-enrolments/types";
import type { Role } from "@/server/db/schema/role";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { Row } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  roles: Role[];
  courseId: string;
}

export function DataTableRowActions<TData>({
  row,
  roles,
  courseId,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();

  const user = row.original as CourseParticipant;
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const { course_id } = useParams();

  const [pending, startMutation] = useTransition();

  async function switchRole(roleId: string) {
    const error = await updateCourseEnrolmentAction({
      userId: user.id,
      courseId,
      roleId,
    });

    error
      ? toast.error(`Failed to switch roles`, {
          description: error ?? "Error",
        })
      : toast.success(`Roles switched successfully!`);
  }

  async function deleteEnrolment(userId: string, courseId: string) {
    startMutation(async () => {
      const error = await deleteCourseEnrolmentAction({ courseId, userId });
      const failed = Boolean(error);
      if (failed) {
        toast.error(`Failed to delete enrolment`, {
          description: error ?? "Error",
        });
      } else {
        toast.success(`Enrolment deleted!`);
        router.refresh();
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="ml-auto flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={user.role || undefined}>
                {roles.map((role) => (
                  <DropdownMenuRadioItem
                    key={role.id}
                    value={role.name ? role.name : ""}
                    className="justify-start"
                    onSelect={async () =>
                      user.role !== role.name && (await switchRole(role.id))
                    }
                  >
                    {role.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-400"
          >
            Kick
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              user&apos;s enrolment from this course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              asChild
              className={buttonVariants({ variant: "destructive" })}
            >
              <Button
                type="button"
                disabled={pending}
                variant="destructive"
                onClick={() => {
                  startMutation(async () => {
                    await deleteEnrolment(user.id, course_id?.toString() ?? "");
                  });
                }}
              >
                Delet{pending ? "ing..." : "e"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
