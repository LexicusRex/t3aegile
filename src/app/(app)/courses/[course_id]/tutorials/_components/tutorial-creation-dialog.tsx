"use client";

import React from "react";

import { PlusCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TutorialForm } from "@/components/forms/tutorials/tutorial-form";

export default function TutorialCreationDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircleIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            New Tutorial
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a course</DialogTitle>
          <DialogDescription>
            Create a new course. Click submit when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <TutorialForm closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
