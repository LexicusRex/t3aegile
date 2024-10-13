import type { Group } from "@/server/db/schema/group";
import { PyramidIcon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AssignmentMembersDataTable from "./assignment-members-table/assignment-members-table";
import type { ColumnSchema as MembersColumnSchema } from "./assignment-members-table/schema";
import AssignmentTeamsDataTable from "./assignment-teams-table/assignment-teams-table";
import type { ColumnSchema as TeamsColumnSchema } from "./assignment-teams-table/schema";

export default function AssignmentTeamsAndMembersCard({
  courseId,
  assignmentId,
  members,
  teams,
  groups,
}: {
  courseId: string;
  assignmentId: string;
  members: MembersColumnSchema[];
  teams: TeamsColumnSchema[];
  groups: Group[];
}) {
  return (
    <Card className="col-span-1 w-full shrink-0 bg-background/80 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 text-sm">
        <CardTitle>Teams & Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full grid-cols-[auto_1fr] gap-x-6">
          <div className="flex min-h-8 items-center py-2 text-xs font-medium text-muted-foreground">
            Assessable Members
          </div>
          <AssignmentMembersDataTableDialog
            courseId={courseId}
            assignmentId={assignmentId}
            members={members}
            groups={groups}
          />

          <div className="flex min-h-8 items-center py-2 text-xs font-medium text-muted-foreground">
            Assessable Teams
          </div>
          <AssignmentTeamsDataTableDialog
            courseId={courseId}
            assignmentId={assignmentId}
            teams={teams} // TODO - exchange
          />
        </div>
      </CardContent>
    </Card>
  );
}

function AssignmentMembersDataTableDialog({
  courseId,
  assignmentId,
  members,
  groups,
}: {
  courseId: string;
  assignmentId: string;
  members: MembersColumnSchema[];
  groups: Group[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 self-center text-xs font-light text-primary/80 shadow-none"
        >
          <UsersIcon className="mr-1 h-3 w-3" />
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-full max-h-[calc(100%-4rem)] w-[calc(100%-8rem)] flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assessable Members</DialogTitle>
          <DialogDescription>
            View and manage assessable members for this assignment. Members
            listed here are liable to submit assignment deliverables. For group
            assignments, staff can group members here.
          </DialogDescription>
        </DialogHeader>
        <AssignmentMembersDataTable
          courseId={courseId}
          assignmentId={assignmentId}
          members={members}
          groups={groups}
        />
      </DialogContent>
    </Dialog>
  );
}

function AssignmentTeamsDataTableDialog({
  courseId,
  assignmentId,
  teams,
}: {
  courseId: string;
  assignmentId: string;
  teams: TeamsColumnSchema[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 self-center text-xs font-light text-primary/80 shadow-none"
        >
          <PyramidIcon className="mr-1 h-3 w-3" />
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-full max-h-[calc(100%-4rem)] w-[calc(100%-8rem)] flex-col items-start overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assessable Teams</DialogTitle>
          <DialogDescription>
            View and manage assessable teams for this assignment. Teams listed
            here are liable to submit assignment deliverables. If enabled,
            members can self-enrol themselves.
          </DialogDescription>
        </DialogHeader>
        <AssignmentTeamsDataTable
          courseId={courseId}
          assignmentId={assignmentId}
          teams={teams}
        />
      </DialogContent>
    </Dialog>
  );
}
