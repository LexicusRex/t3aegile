"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createCourseAction,
  deleteCourseAction,
  updateCourseAction,
} from "@/server/actions/courses";
import { insertCourseParams, type Course } from "@/server/db/schema/course";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { z } from "zod";

import { cn, type Action } from "@/lib/utils";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/back-button";

// import { type TAddOptimistic } from "@/app/(app)/courses/useOptimisticCourses";

const CourseForm = ({
  course,
  openModal,
  closeModal,
  // addOptimistic,
  postSuccess,
}: {
  course?: Course | null;
  openModal?: (course?: Course) => void;
  closeModal?: () => void;
  // addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
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
      postSuccess && postSuccess();
      toast.success(`Course ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const courseParsed = await insertCourseParams.safeParseAsync({
      ...payload,
    });
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
      ...values,
    };
    try {
      startMutation(async () => {
        // addOptimistic &&
        //   addOptimistic({
        //     data: pendingCourse,
        //     action: editing ? "update" : "create",
        //   });

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

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={course?.name ?? ""}
        />
        {errors?.name ? (
          <p className="mt-2 text-xs text-destructive">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.code ? "text-destructive" : "",
          )}
        >
          Code
        </Label>
        <Input
          type="text"
          name="code"
          className={cn(errors?.code ? "ring ring-destructive" : "")}
          defaultValue={course?.code ?? ""}
        />
        {errors?.code ? (
          <p className="mt-2 text-xs text-destructive">{errors.code[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.term ? "text-destructive" : "",
          )}
        >
          Term Offering
        </Label>
        <Input
          type="text"
          name="term"
          className={cn(errors?.term ? "ring ring-destructive" : "")}
          defaultValue={course?.term ?? ""}
        />
        {errors?.term ? (
          <p className="mt-2 text-xs text-destructive">{errors.term[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.description ? "text-destructive" : "",
          )}
        >
          Description
        </Label>
        <Input
          type="text"
          name="description"
          className={cn(errors?.description ? "ring ring-destructive" : "")}
          defaultValue={course?.description ?? ""}
        />
        {errors?.description ? (
          <p className="mt-2 text-xs text-destructive">
            {errors.description[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.isActive ? "text-destructive" : "",
          )}
        >
          Is Active
        </Label>
        <br />
        <Checkbox
          defaultChecked={course?.isActive ?? false}
          name={"isActive"}
          className={cn(errors?.isActive ? "ring ring-destructive" : "")}
        />
        {errors?.isActive ? (
          <p className="mt-2 text-xs text-destructive">{errors.isActive[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
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
    </form>
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
