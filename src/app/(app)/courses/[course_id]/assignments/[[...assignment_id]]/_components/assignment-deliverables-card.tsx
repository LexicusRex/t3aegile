import { Suspense } from "react";

import { getDeliverablesByAssignment } from "@/server/api/crud/deliverables/queries";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import DeliverableCreationDialog from "./deliverable-creation-dialog";

export default async function AssignmentDeliverablesCard({
  courseId,
  assignmentId,
}: {
  courseId: string;
  assignmentId: string;
}) {
  const { deliverables } = await getDeliverablesByAssignment(assignmentId);
  return (
    <Card className="col-span-1 w-full shrink-0 bg-background/80 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 text-sm">
        <CardTitle>Deliverables</CardTitle>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<DeliverableSkeleton />}>
          <div className="space-y-3">
            {deliverables.length > 0 ? (
              deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  // className="flex items-center justify-between rounded-md bg-secondary px-2 py-1"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex items-center justify-between rounded-md px-2 py-1",
                  )}
                >
                  <div>
                    <p className="line-clamp-1 text-sm">{deliverable.name}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {!!deliverable.deadline
                        ? format(deliverable.deadline, "dd MMM yyyy, hh:mm a")
                        : "No deadline"}
                    </p>
                  </div>
                  <p className="font-xl shrink-0 tabular-nums tracking-tighter">
                    {deliverable.weighting}%
                  </p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-between rounded-md border border-dashed border-primary/50 px-2 py-1 opacity-50">
                <div>
                  <p className="text-sm font-medium">Submission Name</p>
                  <p className="text-xs text-muted-foreground">
                    dd MMM yyyy, hh:mm a
                  </p>
                </div>
                <p className="font-xl shrink-0 tabular-nums tracking-tighter">
                  XX.X%
                </p>
              </div>
            )}
            <DeliverableCreationDialog
              courseId={courseId}
              assignmentId={assignmentId}
            />
          </div>
        </Suspense>
      </CardContent>
    </Card>
  );
}

function DeliverableSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-[46px] w-full rounded-md" />;
      <Skeleton className="h-[46px] w-full rounded-md" />;
      <Skeleton className="h-[46px] w-full rounded-md" />;
    </div>
  );
}
