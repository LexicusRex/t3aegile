"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";

import { createCourseEnrolmentAction } from "@/server/actions/courseEnrolments";
import type { CourseEnrollable } from "@/server/api/crud/course-enrolments/types";
import { Users } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EnrolParticipantsDialog({
  courseId,
  enrollableUsers,
}: {
  courseId: string;
  enrollableUsers: CourseEnrollable[];
}) {
  const router = useRouter();
  const [pending, startMutation] = useTransition();

  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredUsers = enrollableUsers.filter((user: CourseEnrollable) => {
    return (
      user.name?.toLowerCase().includes(searchTerm) ??
      user.email.toLowerCase().includes(searchTerm)
    );
  });

  async function enrolUser(userId: string) {
    console.log("Enrolling user", userId);
    startMutation(async () => {
      const error = await createCourseEnrolmentAction({ courseId, userId });
      const failed = Boolean(error);
      if (failed) {
        toast.error(`Failed to create`, {
          description: error ?? "Error",
        });
      } else {
        toast.success(`User enrolled!`);
        router.refresh();
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Enrol Participants
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enrol Participants</DialogTitle>
          <DialogDescription>
            Enrol existing and verified users to this course.
          </DialogDescription>
        </DialogHeader>

        <Input
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <ScrollArea className="max-h-[calc(100dvh-18rem)] pr-1">
          {!filteredUsers.length && (
            <div className="flex items-center justify-center">
              <p className="text-sm text-gray-400">No users found...</p>
            </div>
          )}
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-y-0 rounded-md p-2 hover:bg-muted/60"
            >
              <Avatar className="border">
                <AvatarImage src={user?.image ?? ""} alt="@shadcn" />
                <AvatarFallback>
                  {user.name?.charAt(0)}
                  {/* {user.last_name.charAt(0)} */}
                </AvatarFallback>
              </Avatar>
              <p className="mx-3 line-clamp-1 text-sm">
                {user.name} - {user.email}
              </p>
              <Button
                variant="outline"
                className="ml-auto"
                disabled={pending}
                onClick={() => enrolUser(user.id)}
              >
                Add{pending ? "ing..." : ""}
              </Button>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
