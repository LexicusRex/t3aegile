"use client";

import React, { useTransition } from "react";
import { useParams, useRouter } from "next/navigation";

import { deleteCourseEnrolmentAction } from "@/server/actions/courseEnrolments";
// import AlertDeleteDialog from "@/components/alert-delete-dialog";

// import { roles } from "./data";
import type { CourseParticipant } from "@/server/api/crud/course-enrolments/types";
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
  // DropdownMenuRadioItem,
  DropdownMenuSeparator,
  // DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { taskSchema } from '../data/schema';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();

  const user = row.original as CourseParticipant;
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const { course_id } = useParams();

  const [pending, startMutation] = useTransition();

  // async function switchRole(role: string) {
  // await clientFetch(
  //   `/api/courses/${course_id}/enrolments/${user.id}`,
  //   "PUT",
  //   { role },
  // )
  //   .then((data) => {
  //     toast.success("Member role changed successfully!");
  //     router.refresh();
  //   })
  //   .catch((error) => toast.error(error.message));
  // }

  async function deleteEnrolment(userId: string, courseId: string) {
    startMutation(async () => {
      console.log("🚀 ~ startMutation ~ { courseId, userId }:", {
        courseId,
        userId,
      });
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
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={user.role || undefined}>
                {/* {roles.map((role) => (
                  <DropdownMenuRadioItem
                    key={role.value}
                    value={role.value ? role.value : ""}
                    className="justify-start"
                    onSelect={() => switchRole(role.value)}
                  >
                    {role.label}
                  </DropdownMenuRadioItem>
                ))} */}
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
        {/* <AlertDialogTrigger>Kick</AlertDialogTrigger> */}
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
