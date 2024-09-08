"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteRoleAction } from "@/server/actions/roles";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useBackPath } from "@/components/shared/back-button";

export default function RoleSettingsDeleteForm({ roleId }: { roleId: string }) {
  const [pending, startMutation] = useTransition();
  const router = useRouter();
  const backpath = useBackPath(roleId);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold leading-none tracking-tight text-destructive">
          Danger Zone
        </h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete this course and all associated data.
        </p>
      </div>
      <Separator />
      {/* Delete Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete Course</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              course and remove all course associated data from our servers.
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
                    const error = await deleteRoleAction(roleId);
                    if (error) {
                      toast.error(`Failed to delete`, {
                        description: error ?? "Error",
                      });
                    } else {
                      toast.success(`Role deleted!`);
                      router.push(backpath);
                    }
                  });
                }}
              >
                Delet{pending ? "ing..." : "e"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
