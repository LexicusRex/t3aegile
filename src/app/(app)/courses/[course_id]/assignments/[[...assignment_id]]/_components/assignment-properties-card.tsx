import type { Assignment } from "@/server/db/schema/assignment";
import { SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import AssignmentUpdateForm from "@/components/forms/assignments/assignment-update-form";

export default async function AssignmentPropertiesCard({
  assignment,
}: {
  assignment: Assignment;
}) {
  return (
    <Card className="col-span-1 w-full shrink-0 bg-background/80 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pt-6">
        <CardTitle>Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <AssignmentUpdateForm assignment={assignment} />
      </CardContent>
    </Card>
  );
}
