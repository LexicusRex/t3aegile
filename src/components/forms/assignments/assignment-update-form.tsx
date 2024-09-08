"use client";

import { useTransition } from "react";

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
import { Button } from "@/components/ui/button";
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
import { TimePickerFields } from "@/components/datetime-picker/time-picker-fields";
import { FloatingAlert } from "@/components/forms/floating-alert";

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
  const form = useForm<AssignmentUpdateFormValues>({
    resolver: zodResolver(updateAssignmentParams),
    defaultValues: {
      ...assignment,
      name: assignment.name ?? undefined,
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
      // const error = await updateRolePermissionsAction(payload);
      // if (error) {
      //   toast.error(`Failed to update`, {
      //     description: error ?? "Error",
      //   });
      // } else {
      //   form.reset(data);
      //   toast.success(`Role permissions updated!`);
      //   router.refresh();
      // }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              {/* {<FormLabel>Role Name</FormLabel>} */}
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    {...field}
                    placeholder="Assignment Title"
                    className="border-0 border-border px-0 text-2xl font-medium shadow-none focus-visible:ring-0"
                  />
                  <PencilIcon className="h-5 w-5 text-gray-400 opacity-30 transition-opacity duration-200 ease-in-out hover:opacity-100" />
                </div>
              </FormControl>
              {/* <FormDescription>Edit the assignment name</FormDescription> */}
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
              <FormMessage />
            </FormItem>
          )}
        />
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
