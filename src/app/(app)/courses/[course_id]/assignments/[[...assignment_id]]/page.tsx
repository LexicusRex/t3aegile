import { notFound } from "next/navigation";

import { getAssignmentById } from "@/server/api/crud/assignments/queries";
import { getDeliverablesByAssignment } from "@/server/api/crud/deliverables/queries";
import { ClipboardList } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import AssignmentDeleteForm from "@/components/forms/assignments/assignment-delete-form";
import AssignmentUpdateForm from "@/components/forms/assignments/assignment-update-form";

import DeliverableCard from "./_components/deliverable-card";
import DeliverableCreationDialog from "./_components/deliverable-creation-dialog";

interface AssignmentPageProps {
  params: { course_id: string; assignment_id?: string[] };
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  // if params doesn't have an assignment_id, show an empty state
  if (!params.assignment_id) return <AssignmentsEmptyState />;
  if (params.assignment_id.length > 1) return notFound();

  const assignmentId = params.assignment_id?.[0] ?? "";
  const { assignment } = await getAssignmentById(assignmentId);
  if (!assignment) return notFound();

  const { deliverables } = await getDeliverablesByAssignment(assignmentId);

  return (
    <div className="space-y-8">
      <AssignmentUpdateForm assignment={assignment} editing={true} />

      <div>
        <h4 className="mb-2 text-lg font-medium">Outline</h4>
        <Textarea
          className="w-full"
          rows={25}
          defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa repellat ipsum laborum at iure? Veniam consequuntur aut voluptatibus esse dolor quae quos, dolore, voluptatem repellat, incidunt aspernatur nulla placeat facere."
        />
      </div>
      <div>
        <div className="mb-2 flex items-end justify-between">
          <h4 className="text-lg font-medium">Deliverables</h4>
          <DeliverableCreationDialog
            courseId={params.course_id}
            assignmentId={assignment.id}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-3">
          {deliverables.map((deliverable) => (
            <DeliverableCard
              status={""}
              key={deliverable.id}
              {...deliverable}
            />
          ))}
        </div>
      </div>
      <AssignmentDeleteForm assignment={assignment} />
    </div>
  );
}

function AssignmentsEmptyState() {
  return (
    <div className="mx-auto flex grow flex-col items-center justify-center p-6 text-center">
      <div className="relative">
        <ClipboardList
          className="mb-2 h-16 w-16 text-gray-400"
          strokeWidth={1.5}
        />
        <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full bg-blue-500" />
      </div>
      <h2 className="mb-2 text-lg font-semibold">No Assignment Selected</h2>
      <p className="text-sm text-gray-500">
        Pick an assignment from the list to view and manage it.
      </p>
    </div>
  );
}
