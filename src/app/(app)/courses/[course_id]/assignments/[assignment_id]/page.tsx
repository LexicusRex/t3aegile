import { notFound } from "next/navigation";

import { getAssignmentById } from "@/server/api/crud/assignments/queries";

import AssignmentUpdateForm from "@/components/forms/assignments/assignment-update-form";

interface AssignmentPageProps {
  params: { course_id: string; assignment_id: string };
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
  const { assignment } = await getAssignmentById(params.assignment_id);

  if (!assignment) return notFound();

  return (
    <>
      <AssignmentUpdateForm assignment={assignment} editing={true} />
    </>
  );
}
