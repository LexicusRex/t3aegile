"use client";

import { useTransition } from "react";

import { createAssignmentAction } from "@/server/actions/assignments";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NewAssignmentButton({
  courseId,
}: {
  courseId: string;
}) {
  const [pending, startMutation] = useTransition();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() =>
        startMutation(async () => {
          await createAssignmentAction({ courseId });
        })
      }
      disabled={pending}
    >
      <PlusIcon className="mr-1 h-4 w-4" />
      <span className="">{pending ? "Creating..." : "New"}</span>
    </Button>
  );
}
