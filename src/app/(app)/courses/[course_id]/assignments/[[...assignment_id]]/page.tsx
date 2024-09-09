import { notFound } from "next/navigation";

import { getAssignmentById } from "@/server/api/crud/assignments/queries";
import { ClipboardList } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import AssignmentUpdateForm from "@/components/forms/assignments/assignment-update-form";

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

  return (
    <>
      <AssignmentUpdateForm assignment={assignment} editing={true} />
    </>
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
// import { ClipboardList } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";

// export default function AssignmentPicker() {
//   return (
//     <Card className="mx-auto w-full max-w-md">
//       <CardContent className="flex flex-col items-center justify-center p-6 text-center">
//         <div className="relative">
//           <ClipboardList
//             className="mb-4 h-16 w-16 text-gray-400"
//             strokeWidth={1.5}
//           />
//           <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full bg-blue-500" />
//         </div>
//         <h2 className="mb-2 text-xl font-semibold">No Assignment Selected</h2>
//         <p className="text-sm text-gray-500">
//           Pick an assignment from the list to view and manage it.
//         </p>
//       </CardContent>
//     </Card>
//   );
// }
