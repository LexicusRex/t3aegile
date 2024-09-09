"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { createDeliverableAction } from "@/server/actions/deliverables";
import {
  insertDeliverableParams,
  type Deliverable,
} from "@/server/db/schema/deliverable";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { cn } from "@/lib/utils";
import { useValidatedForm } from "@/hooks/useValidatedForm";
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
import { Textarea } from "@/components/ui/textarea";
import { TimePickerFields } from "@/components/datetime-picker/time-picker-fields";
import { useBackPath } from "@/components/shared/back-button";

import { FloatingAlert } from "../floating-alert";

type NewDeliverableFormValues = z.infer<typeof insertDeliverableParams>;

export function DeliverableForm({
  deliverable,
  courseId,
  assignmentId,
  closeDialog,
}: {
  deliverable?: Deliverable;
  courseId: string;
  assignmentId: string;
  closeDialog?: () => void;
}) {
  const [pending, startMutation] = useTransition();
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Deliverable>(insertDeliverableParams);
  const editing = !!deliverable?.id;
  const router = useRouter();
  const backpath = useBackPath(deliverable?.id ?? "");

  const form = useForm<NewDeliverableFormValues>({
    resolver: zodResolver(insertDeliverableParams),
    defaultValues: {
      ...deliverable,
      courseId,
      assignmentId,
      name: deliverable?.name ?? "",
      description: deliverable?.description ?? "",
      // name: deliverable?.name ?? undefined,
    },
    mode: "onChange",
  });

  console.log("🚀 ~ form:", form);
  function onSubmit(data: NewDeliverableFormValues) {
    console.log("🚀 ~ onSubmit ~ data:", data);
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );

    startMutation(async () => {
      const error = await createDeliverableAction(data);
      if (error) {
        toast.error(`Failed to create`, {
          description: error ?? "Error",
        });
      } else {
        form.reset(data);
        toast.success(`New deliverable successfully created!`);
        closeDialog?.();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deliverable Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Enter deliverable name"
                  />
                </FormControl>
                <FormDescription>
                  Edit the name of the deliverable
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weighting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weighting</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    placeholder="Enter weighting"
                  />
                </FormControl>
                <FormDescription>
                  The weighting of the deliverable as a percentage
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="availableAt"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Available At</FormLabel>
              <DateTimePicker field={field} />
              <FormDescription>
                The date the deliverable becomes available
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Deadline</FormLabel>
                <DateTimePicker field={field} />
                <FormDescription>
                  The date the deliverable is due
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cutoff"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Cutoff</FormLabel>
                <DateTimePicker field={field} />
                <FormDescription>
                  The date the deliverable is no longer accepted
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter description"
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription>
                A brief description of the deliverable
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {editing ? (
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
              <SaveButton
                errors={hasErrors}
                editing={editing}
                pending={form.formState.isSubmitting}
                isDirty={form.formState.isDirty}
              />
            </div>
          </FloatingAlert>
        ) : (
          <SaveButton
            errors={hasErrors}
            editing={editing}
            pending={form.formState.isSubmitting}
            isDirty={form.formState.isDirty}
          />
        )}
      </form>
    </Form>
  );
}

const SaveButton = ({
  editing,
  errors,
  pending,
  isDirty,
}: {
  editing: boolean;
  errors: boolean;
  pending: boolean;
  isDirty?: boolean;
}) => {
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      // className="mr-2"
      disabled={isCreating || isUpdating || errors || !isDirty}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e Changes"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};

type DateFieldProps = Omit<ControllerRenderProps<Deliverable>, "value"> & {
  value: Date | null;
};

const DateTimePicker = ({ field }: { field: DateFieldProps }) => {
  return (
    <Popover modal={true}>
      <FormControl>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-9 w-full justify-start px-2 py-1 text-left text-[0.825rem] font-normal",
              !field.value && "text-muted-foreground",
            )}
          >
            {field.value ? (
              format(field.value, "eee, dd MMM, yyy  ->  hh:mm a")
            ) : (
              <>
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>Pick a date & time</span>
              </>
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
  );
};
