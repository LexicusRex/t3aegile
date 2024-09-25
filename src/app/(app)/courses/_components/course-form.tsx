"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createCourseAction,
  deleteCourseAction,
  updateCourseAction,
} from "@/server/actions/courses";
import { insertCourseParams, type Course } from "@/server/db/schema/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { type Action } from "@/lib/utils";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { AlertDeleteDialog } from "@/components/forms/alert-delete-dialog";
import { FloatingAlert } from "@/components/forms/floating-alert";

const CourseForm = ({
  course,
  closeDialog,
}: {
  course?: Course | null;
  closeDialog?: () => void;
}) => {
  const { hasErrors, setErrors, handleChange } =
    useValidatedForm<Course>(insertCourseParams);
  const editing = !!course?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = "/courses";

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Course },
    payload?: Course,
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      form.reset(payload);
      toast.success(`Course ${action}d!`);
      closeDialog && closeDialog();
      router.refresh();
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: Course) => {
    // timeout 5 seconds here
    await new Promise((resolve) => setTimeout(resolve, 250));
    setErrors(null);

    const payload = data;
    toast(
      <div className="w-full">
        <p>You are attempting to submit the following values:</p>
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(payload, null, 2)}</code>
        </pre>
      </div>,
    );
    const courseParsed = await insertCourseParams.safeParseAsync({
      ...payload,
    });

    if (!courseParsed.success) {
      setErrors(courseParsed?.error.flatten().fieldErrors);
      return;
    }

    const values = courseParsed.data;
    const pendingCourse: Course = {
      updatedAt: course?.updatedAt ?? new Date(),
      createdAt: course?.createdAt ?? new Date(),
      id: course?.id ?? "",
      memberCount: Number(course?.memberCount) ?? null,
      ...values,
    };
    try {
      startMutation(async () => {
        const error = editing
          ? await updateCourseAction({ ...values, id: course.id })
          : await createCourseAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingCourse,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
          payload,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  const form = useForm<Course>({
    resolver: zodResolver(insertCourseParams),
    defaultValues: {
      term: course?.term ?? "",
      code: course?.code ?? "",
      name: course?.name ?? "",
      isActive: course?.isActive ?? true,
      description: course?.description ?? "",
    },
    mode: "onChange",
  });
  const year = new Date().getFullYear().toString().slice(-2);

  return (
    <div className="space-y-12">
      <Form {...form}>
        <form
          // action={handleSubmit}
          onSubmit={form.handleSubmit(handleSubmit)}
          onChange={handleChange}
          className={"space-y-6"}
        >
          {/* Schema fields start */}
          <div className="flex items-start justify-between gap-x-4">
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Term Offering</FormLabel>
                  <Select
                    // defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={`${year}T0`}>{`${year}T0`}</SelectItem>
                      <SelectItem value={`${year}T1`}>{`${year}T1`}</SelectItem>
                      <SelectItem value={`${year}T2`}>{`${year}T2`}</SelectItem>
                      <SelectItem value={`${year}T3`}>{`${year}T3`}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="h-5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="COMP1511" {...field} />
                  </FormControl>
                  <FormMessage className="h-5" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="Programming Fundamentals" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about the course"
                    className="resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Schema fields end */}

          {/* Save Button */}
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
                  const error = await deleteCourseAction(course.id);
                  setIsDeleting(false);
                  const errorFormatted = {
                    error: error ?? "Error",
                    values: course,
                  };

                  onSuccess("delete", error ? errorFormatted : undefined);
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

export default CourseForm;

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
