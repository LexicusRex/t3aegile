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
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn, type Action } from "@/lib/utils";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { useBackPath } from "@/components/shared/back-button";

const CourseForm = ({
  course,
  openModal,
  closeModal,
  closeDialog,
}: {
  course?: Course | null;
  openModal?: (course?: Course) => void;
  closeModal?: () => void;
  closeDialog?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Course>(insertCourseParams);
  const editing = !!course?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("courses");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Course },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      closeDialog && closeDialog();
      toast.success(`Course ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: Course) => {
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
    console.log("🚀 ~ handleSubmit ~ courseParsed:", courseParsed);

    if (!courseParsed.success) {
      setErrors(courseParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = courseParsed.data;
    const pendingCourse: Course = {
      updatedAt: course?.updatedAt ?? new Date(),
      createdAt: course?.createdAt ?? new Date(),
      id: course?.id ?? "",
      memberCount: Number(course?.memberCount) ?? null,
      defaultRoleId: course?.defaultRoleId ?? null,
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
    // defaultValues: {
    //   term: "24T0",
    //   code: "COMP1511",
    //   name: "Programming Fundamentals",
    //   isActive: true,
    //   description: "An introduction to programming in C.",
    // },
    mode: "onChange",
  });
  const year = new Date().getFullYear().toString().slice(-2);
  return (
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

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            {/* Save Button */}
            <>
              <SaveButton errors={hasErrors} editing={editing} />

              {/* Delete Button */}
              {editing ? (
                <Button
                  type="button"
                  disabled={isDeleting || pending || hasErrors}
                  variant={"destructive"}
                  onClick={() => {
                    setIsDeleting(true);
                    closeModal && closeModal();
                    startMutation(async () => {
                      // addOptimistic &&
                      //   addOptimistic({ action: "delete", data: course });
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
              ) : null}
            </>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CourseForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
