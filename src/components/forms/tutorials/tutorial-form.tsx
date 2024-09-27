"use client";

import { useState, useTransition } from "react";
import { useParams } from "next/navigation";

import {
  createTutorialAction,
  deleteTutorialAction,
  updateTutorialAction,
} from "@/server/actions/tutorials";
import {
  insertTutorialParams,
  updateTutorialParams,
  type NewTutorialParams,
  type Tutorial,
  type UpdateTutorialParams,
} from "@/server/db/schema/tutorial";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useHandleFormMutation } from "@/hooks/use-handle-form-mutation";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TimeFormPicker } from "@/components/date-time-picker/form/time-picker";
import { FloatingAlert } from "@/components/forms/floating-alert";

import { AlertDeleteDialog } from "../alert-delete-dialog";

export const TutorialForm = ({
  tutorial,
  closeDialog,
}: {
  tutorial?: Tutorial;
  closeDialog?: () => void;
}) => {
  const { course_id } = useParams();
  const courseId = Array.isArray(course_id) ? course_id[0] : course_id;
  const editing = !!tutorial?.id;

  const [isDeleting, setIsDeleting] = useState(false);

  const { hasErrors } = useValidatedForm<Tutorial>(
    editing ? updateTutorialParams : insertTutorialParams,
  );

  const [pending, startMutation] = useTransition();

  const form = useForm<Tutorial>({
    resolver: zodResolver(
      editing ? updateTutorialParams : insertTutorialParams,
    ),
    defaultValues: {
      id: tutorial?.id ?? "",
      name: tutorial?.name ?? "",
      courseId: tutorial?.courseId ?? courseId,
      location: tutorial?.location ?? "",
      dayOfWeek: tutorial?.dayOfWeek ?? undefined,
      startTime: tutorial?.startTime ?? "",
      endTime: tutorial?.endTime ?? "",
    },
    mode: "onChange",
  });

  const handleFormMutation = useHandleFormMutation<Tutorial>({
    form,
    resource: "tutorial",
    closeDialog,
    backpath: `/courses/${courseId}/tutorials`,
  });

  function onSubmit(data: Tutorial) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );

    const action = editing ? "update" : "create";
    startMutation(async () => {
      const error = editing
        ? await updateTutorialAction(data as UpdateTutorialParams)
        : await createTutorialAction(data as NewTutorialParams);
      handleFormMutation(action, data)(error);
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = await form.trigger();
    if (isValid) {
      await form.handleSubmit(onSubmit)(e);
    } else {
      // Form is invalid, show an error toast
      toast.error(
        <div>
          <p>Form Submission Failed</p>
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(form.formState.errors, null, 2)}
            </code>
          </pre>
        </div>,
      );
    }
  };

  return (
    <div className="space-y-12">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tutorial Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    placeholder="Enter tutorial name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Online"
                  />
                </FormControl>
                <FormDescription>Tutorial class location</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dayOfWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a Day</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    {...field}
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      field.onChange(value ? Number(value) : undefined);
                    }}
                    className="flex"
                  >
                    <ToggleGroupItem value="0" aria-label="Monday">
                      Mon
                    </ToggleGroupItem>
                    <ToggleGroupItem value="1" aria-label="Tuesday">
                      Tue
                    </ToggleGroupItem>
                    <ToggleGroupItem value="2" aria-label="Wednesday">
                      Wed
                    </ToggleGroupItem>
                    <ToggleGroupItem value="3" aria-label="Thursday">
                      Thu
                    </ToggleGroupItem>
                    <ToggleGroupItem value="4" aria-label="Friday">
                      Fri
                    </ToggleGroupItem>
                    <ToggleGroupItem value="5" aria-label="Saturday">
                      Sat
                    </ToggleGroupItem>
                    <ToggleGroupItem value="6" aria-label="Sunday">
                      Sun
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormDescription>
                  Select the day for the tutorial session.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start time</FormLabel>
                  <TimeFormPicker field={field} />
                  {/* <Popover modal={true}>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-9 w-[180px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <ClockIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            new Date(
                              `1970-01-01T${field.value}`,
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          ) : (
                            <span>Pick a time</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto">
                      <TimePickerFields
                        setDate={(time?: Date) => {
                          const datetime = time ?? new Date();
                          datetime.setSeconds(0);
                          field.onChange(datetime.toTimeString().split(" ")[0]);
                        }}
                        date={
                          field.value
                            ? new Date(`1970-01-01T${field.value}`)
                            : new Date()
                        }
                      />
                    </PopoverContent>
                  </Popover> */}
                  <FormDescription>Tutorial&apos;s start time</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start time</FormLabel>
                  <TimeFormPicker field={field} />
                  <FormDescription>Tutorial&apos;s end time</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                  pending={form.formState.isSubmitting || pending}
                  isDirty={form.formState.isDirty}
                />
              </div>
            </FloatingAlert>
          ) : (
            <SaveButton
              errors={hasErrors}
              editing={editing}
              pending={form.formState.isSubmitting || pending}
              isDirty={form.formState.isDirty}
            />
          )}
        </form>
      </Form>
      {editing ? (
        <div className="space-y-6">
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
          <AlertDeleteDialog itemType="course">
            <Button
              type="button"
              disabled={isDeleting || pending || hasErrors}
              variant="destructive"
              onClick={() => {
                setIsDeleting(true);
                startMutation(async () => {
                  const error = await deleteTutorialAction({
                    id: tutorial.id,
                    courseId: tutorial.courseId,
                  });
                  handleFormMutation("delete")(error);
                  setIsDeleting(false);
                });
              }}
            >
              Delet{isDeleting ? "ing..." : "e"}
            </Button>
          </AlertDeleteDialog>
        </div>
      ) : null}
    </div>
  );
};

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
