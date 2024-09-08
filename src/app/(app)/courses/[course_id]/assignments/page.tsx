import { ClipboardList } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function AssignmentsPage() {
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
