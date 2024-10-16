"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createGroupAction } from "@/server/actions/groups";
import {
  insertGroupSchema,
  updateGroupSchema,
  type Group,
} from "@/server/db/schema/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { TimePickerFields } from "@/components/datetime-picker/time-picker-fields";
import { useBackPath } from "@/components/shared/back-button";

import { FloatingAlert } from "../floating-alert";

type NewGroupFormValues = z.infer<typeof insertGroupSchema>;

export function GroupForm({
  group,
  courseId,
  assignmentId,
  closeDialog,
}: {
  group?: Group;
  courseId: string;
  assignmentId: string;
  closeDialog?: () => void;
}) {
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");

  const [pending, startMutation] = useTransition();
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Group>(insertGroupSchema);
  const editing = !!group?.id;

  const form = useForm<NewGroupFormValues>({
    resolver: zodResolver(editing ? updateGroupSchema : insertGroupSchema),
    defaultValues: {
      ...group,
      courseId,
      assignmentId,
      name: group?.name ?? "",
      identifier: group?.identifier ?? "",
    },
    mode: "onChange",
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (identifier === "" || identifier === name.slice(0, 3).toUpperCase()) {
      const newIdentifier = newName.slice(0, 3).toUpperCase();
      setIdentifier(newIdentifier);
      form.setValue("identifier", newIdentifier.toUpperCase());
    }
  };
  function onSubmit(data: NewGroupFormValues) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );

    startMutation(async () => {
      const error = await createGroupAction(data);
      if (error) {
        toast.error(`Failed to create`, {
          description: error ?? "Error",
        });
      } else {
        form.reset(data);
        toast.success(`New group successfully created!`);
        closeDialog?.();
      }
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
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNameChange(e);
                    }}
                    placeholder="Enter group name"
                  />
                </FormControl>
                <FormDescription>Edit the name of the group</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identifier</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={identifier}
                    placeholder={identifier ?? "ABC"}
                    onChange={(e) => {
                      field.onChange(e);
                      setIdentifier(e.target.value.toUpperCase());
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Used as a prefix for all team tasks (e.g. ABC-123). Keep it
                  short and simple.
                </FormDescription>
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
