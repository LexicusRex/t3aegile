"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  deleteAssignmentAction,
  updateAssignmentAction,
} from "@/server/actions/assignments";
import {
  updateAssignmentParams,
  type Assignment,
} from "@/server/db/schema/assignment";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, PencilIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { TimePickerFields } from "@/components/datetime-picker/time-picker-fields";
import { FloatingAlert } from "@/components/forms/floating-alert";
import { useBackPath } from "@/components/shared/back-button";

interface AssignmentUpdateFormProps {
  assignment: Assignment;
  editing: boolean;
}

type AssignmentUpdateFormValues = z.infer<typeof updateAssignmentParams>;

export default function AssignmentUpdateForm({
  assignment,
  editing,
}: AssignmentUpdateFormProps) {
  const [pending, startMutation] = useTransition();
  const router = useRouter();
  const backpath = useBackPath(assignment.id);

  const form = useForm<AssignmentUpdateFormValues>({
    resolver: zodResolver(updateAssignmentParams),
    defaultValues: {
      ...assignment,
      name: assignment.name ?? "Untitled Assignment",
    },
    mode: "onChange",
  });

  function onSubmit(data: AssignmentUpdateFormValues) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );

    startMutation(async () => {
      const error = await updateAssignmentAction(data);
      if (error) {
        toast.error(`Failed to update`, {
          description: error ?? "Error",
        });
      } else {
        form.reset(data);
        toast.success(`Assignment updated!`);
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              {/* {<FormLabel>Role Name</FormLabel>} */}
              <FormControl>
                <div className="group flex items-center space-x-2">
                  <Input
                    type="text"
                    {...field}
                    placeholder="Assignment Title"
                    className="border-0 border-border px-0 text-2xl font-medium shadow-none placeholder:text-gray-300 focus-visible:ring-0"
                  />
                  <PencilIcon className="h-5 w-5 text-gray-400 opacity-30 transition-opacity duration-200 ease-in-out group-hover:opacity-100" />
                </div>
              </FormControl>
              <FormDescription>Click to edit</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availableAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-left">Available At</FormLabel>
              <Popover>
                <FormControl>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-9 w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "eee, dd MMM, yyy  ->  hh:mm a")
                      ) : (
                        <span>Pick a date & time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                </FormControl>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                    initialFocus
                  />
                  <div className="border-t border-border p-3">
                    <TimePickerFields
                      setDate={field.onChange}
                      date={field.value ?? undefined}
                    />
                  </div>
                </PopoverContent>
              </Popover>
              <FormDescription>
                The datetime at which the assignment will be active & viewable
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <h3 className="font-semibold leading-none tracking-tight text-destructive">
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete this course and all associated data.
          </p>
        </div>
        <Separator />
        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Assignment</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                assignment and remove all its related data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                asChild
                className={buttonVariants({ variant: "destructive" })}
              >
                <Button
                  type="button"
                  disabled={pending}
                  variant="destructive"
                  onClick={() => {
                    startMutation(async () => {
                      const error = await deleteAssignmentAction({
                        courseId: assignment.courseId,
                        id: assignment.id,
                      });
                      if (error) {
                        toast.error(`Failed to delete`, {
                          description: error ?? "Error",
                        });
                      } else {
                        toast.success(`Assignment deleted!`);
                        router.push(backpath);
                      }
                    });
                  }}
                >
                  Delet{pending ? "ing..." : "e"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <FloatingAlert isDirty={form.formState.isDirty}>
          <div className="flex items-center gap-x-2">
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={(e) => {
                e.preventDefault();
                form.reset();
              }}
            >
              Reset
            </Button>
            <Button type="submit" disabled={pending}>
              Updat{pending ? "ing..." : "e"}
            </Button>
          </div>
        </FloatingAlert>
      </form>
    </Form>
  );
}
