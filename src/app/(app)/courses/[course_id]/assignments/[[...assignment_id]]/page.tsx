import Link from "next/link";
import { notFound } from "next/navigation";

import { getAssignmentById } from "@/server/api/crud/assignments/queries";
import { getDeliverablesByAssignment } from "@/server/api/crud/deliverables/queries";
import { verifyProtectedPermission } from "@/server/auth";
import { api } from "@/trpc/server";
import { CaretLeftIcon, CaretRightIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
  ClipboardList,
  PencilIcon,
  PlusCircleIcon,
  PlusIcon,
  SaveIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";

import { PERM_ASSIGNMENT_MANAGE_CORE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AssignmentDeleteForm from "@/components/forms/assignments/assignment-delete-form";
import AssignmentUpdateForm from "@/components/forms/assignments/assignment-update-form";

import AssignmentDeliverablesCard from "./_components/assignment-deliverables-card";
import AssignmentMembersDataTable from "./_components/assignment-members-table/assignment-members-table";
import AssignmentPropertiesCard from "./_components/assignment-properties-card";
import AssignmentTeamsAndMembersCard from "./_components/assignment-teams-and-members-card";
import DeliverableCard from "./_components/deliverable-card";
import DeliverableCreationDialog from "./_components/deliverable-creation-dialog";

interface AssignmentPageProps {
  params: { course_id: string; assignment_id?: string[] };
  searchParams?: { view?: "outline" | "members" };
}

type Team = {
  id: string;
  identifier: string;
  name: string;
  users: {
    name: string;
    image: string;
  }[];
};

export default async function AssignmentPage({
  params,
  searchParams,
}: AssignmentPageProps) {
  // if params doesn't have an assignment_id, show an empty state
  if (!params.assignment_id) return <AssignmentsEmptyState />;
  if (params.assignment_id.length > 1) return notFound();

  const courseId = params.course_id;
  const assignmentId = params.assignment_id?.[0] ?? "";
  const { assignment } = await getAssignmentById(assignmentId);
  if (!assignment) return notFound();

  const { members } = await api.assignment.getAssessableMembersByAssignmentId({
    courseId,
    assignmentId,
  });

  const { groups } = await api.group.getAllByAssignmentId({ id: assignmentId });
  const { teams } = (await api.group.getAllUserGroupsByAssignmentId({
    id: assignmentId,
  })) as { teams: Team[] };
  // if assignment is inactive and user doesn't have permission to view inactive assignments, use the Protect component

  const { team } = await api.group.getAuthUserEnrolledGroup({
    id: assignmentId,
  });

  const isActive =
    assignment.availableAt && assignment.availableAt < new Date();

  const { access: hasViewInactiveAssingmentPermission } =
    await verifyProtectedPermission(
      params.course_id,
      PERM_ASSIGNMENT_MANAGE_CORE,
    );
  const { access: hasAssignmentEditPermission } =
    await verifyProtectedPermission(
      params.course_id,
      PERM_ASSIGNMENT_MANAGE_CORE,
    );
  if (!isActive && !hasViewInactiveAssingmentPermission) {
    return <AssignmentsEmptyState />;
  }

  return (
    <div className={cn("relative flex w-full space-y-0")}>
      <div className="relative grid w-full shrink-0 grid-cols-2 gap-4 self-start xl:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <Card className="w-full shrink-0 bg-background/80 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pt-6">
              <CardTitle className="text-xl">{assignment.name}</CardTitle>
              {/* <p>{format(assignment.nextDeadline, "dd MMMM yyyy, hh:mm a")}</p> */}
            </CardHeader>
            <CardContent>
              {/* <AssignmentUpdateForm
                assignment={assignment}
                editing={hasAssignmentEditPermission}
              /> */}
              <h4 className="text-md mb-2 font-medium">Outline</h4>
              <Textarea
                className="w-full border-none"
                rows={25}
                defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa repellat ipsum laborum at iure? Veniam consequuntur aut voluptatibus esse dolor quae quos, dolore, voluptatem repellat, incidunt aspernatur nulla placeat facere."
                disabled={!hasAssignmentEditPermission}
              />
            </CardContent>
          </Card>
        </div>
        <div className="order-first col-span-2 grid grid-cols-2 flex-col gap-4 self-start xl:order-last xl:col-span-1 xl:flex">
          {team && (
            <Card className="w-full shrink-0 bg-background/80 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pt-6 text-sm">
                <CardTitle>My Team</CardTitle>
              </CardHeader>
              <CardContent>
                {team?.name} {team?.identifier}
              </CardContent>
            </Card>
          )}
          <AssignmentPropertiesCard assignment={assignment} />
          <AssignmentDeliverablesCard
            courseId={courseId}
            assignmentId={assignmentId}
          />
          <AssignmentTeamsAndMembersCard
            courseId={courseId}
            assignmentId={assignmentId}
            members={members}
            teams={teams}
            groups={groups}
          />
        </div>
      </div>
      {/* <Card
        className={cn(
          "relative min-h-fit w-full shrink-0 translate-x-4 shadow-none transition-all duration-300",
          searchParams?.view === "members" && "-translate-x-full",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pt-6">
          <CardTitle>Members & Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <AssignmentMembersDataTable members={members} />
        </CardContent>
        <Link
          href={
            searchParams?.view === "members" ? "?view=outline" : "?view=members"
          }
          className={cn(
            "absolute top-[50%] z-0 -translate-y-1/2 transform",
            searchParams?.view === "members"
              ? "right-0 translate-x-1/2"
              : "left-0 -translate-x-1/2",
            buttonVariants({ variant: "outline", size: "icon" }),
            "h-8 w-6 text-muted-foreground",
          )}
        >
          {searchParams?.view === "members" ? (
            <CaretRightIcon className="h-5 w-5" />
          ) : (
            <CaretLeftIcon className="h-5 w-5" />
          )}
        </Link>
      </Card> */}
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
