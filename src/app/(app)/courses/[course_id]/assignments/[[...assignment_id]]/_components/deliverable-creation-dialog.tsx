"use client";

import React from "react";

import { PlusCircleIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeliverableForm } from "@/components/forms/deliverables/deliverable-form";

interface DeliverableCreationDialogProps {
  courseId: string;
  assignmentId: string;
}

export default function DeliverableCreationDialog({
  courseId,
  assignmentId,
}: DeliverableCreationDialogProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button size="sm" className="h-7 gap-1">
          <PlusCircleIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            New
          </span>
          </Button> */}
        <div className="flex min-h-56 grow cursor-pointer flex-col items-center justify-center rounded-xl border bg-muted/30 hover:bg-muted">
          <PlusIcon className="" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            New
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a course</DialogTitle>
          <DialogDescription>
            Create a new course. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <DeliverableForm
          courseId={courseId}
          assignmentId={assignmentId}
          closeDialog={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
