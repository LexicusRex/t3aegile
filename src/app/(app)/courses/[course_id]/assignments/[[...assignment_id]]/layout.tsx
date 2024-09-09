import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getAssignmentsByCourse } from "@/server/api/crud/assignments/queries";
import type { Assignment } from "@/server/db/schema/assignment";
import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import NewAssignmentButton from "./_components/new-assignment-button";

interface AssignmentsLayoutProps {
  params: { course_id: string; assignment_id?: string[] };
  children: ReactNode;
}

export default async function AssignmentsLayout({
  params,
  children,
}: AssignmentsLayoutProps) {
  const { assignments } = await getAssignmentsByCourse(params.course_id);

  return (
    <>
      <div className="space-y-2">
        <h2 className="font-semibold leading-none tracking-tight">
          Course Assignments
        </h2>
        <p className="text-sm text-muted-foreground">
          View and manage your course assignments.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex grow">
        <div className="sticky top-16 max-w-[500px] grow self-start">
          <Tabs defaultValue="ongoing">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="ongoing"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Ongoing
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="text-zinc-600 dark:text-zinc-200"
              >
                Archived
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ongoing">
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="flex flex-col gap-2 py-2">
                  {assignments.map((assignment) => (
                    <AssignmentItem
                      key={assignment.id}
                      assignmentId={params.assignment_id?.[0]}
                      courseId={params.course_id}
                      assignment={assignment}
                    />
                  ))}
                  <NewAssignmentButton courseId={params.course_id} />
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="archived">
              <ScrollArea className="h-[calc(100vh-8rem)]"></ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
        <div className="mx-6 hidden w-[1px] shrink-0 bg-zinc-200 dark:bg-zinc-800 lg:block" />
        {/* <Select onValueChange={() => router.push}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select> */}
        <div className="grow">{children}</div>
      </div>
    </>
  );
}

function AssignmentItem({
  assignmentId,
  courseId,
  assignment,
}: {
  assignmentId?: string;
  courseId: string;
  assignment: Assignment;
}) {
  const selected = assignmentId === assignment.id;
  return (
    <Link
      href={`/courses/${courseId}/assignments/${assignment.id}`}
      className={cn(
        "flex w-full flex-col items-start gap-2 rounded-lg border bg-background/80 p-3 text-left text-sm transition-all duration-300 hover:shadow-md",
        selected && "border-primary/30 shadow-md",
      )}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">
              {assignment.name ?? "Untitled Assignment"}
            </div>
            {/* {!assignment.read && (
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
            )} */}
          </div>
          <div
            className={cn(
              "ml-auto text-xs",
              selected ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {assignment.nextDeadline
              ? formatDistanceToNow(new Date(assignment.nextDeadline), {
                  addSuffix: true,
                })
              : "No deadline"}
          </div>
        </div>
        {/* <div className="text-xs font-medium">{assignment.variant}</div> */}
        <div className="text-xs font-medium">Group</div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        {/* {assignment.description.substring(0, 300)} */}
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla illum
        veniam molestiae eius eligendi. Amet magnam fugit ea perspiciatis
        adipisci minima deserunt in voluptas? Tempora at obcaecati sed
        blanditiis repellendus?
      </div>
      <div className="flex w-full flex-nowrap items-center justify-between">
        {/* {assignment?.labels.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {assignment.labels.map((label) => (
              <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                {label}
              </Badge>
            ))}
          </div>
        ) : null} */}
      </div>
    </Link>
  );
}
