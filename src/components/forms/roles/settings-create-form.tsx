"use client";

import { useTransition } from "react";

import { createRoleAction } from "@/server/actions/roles";
import { insertRoleParams } from "@/server/db/schema/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

type NewRoleFormValues = z.infer<typeof insertRoleParams>;

export function RoleCreationForm({ courseId }: { courseId: string }) {
  const [pending, startMutation] = useTransition();
  const form = useForm<NewRoleFormValues>({
    resolver: zodResolver(insertRoleParams),
    defaultValues: {
      name: "",
      courseId,
      isCourseDefault: false,
    },
    mode: "onChange",
  });

  function onSubmit(data: NewRoleFormValues) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );

    startMutation(async () => {
      const error = await createRoleAction(data);
      if (error) {
        toast.error(`Failed to create`, {
          description: error ?? "Error",
        });
      } else {
        form.reset(data);
        toast.success(`New role successfully created!`);
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          {`${"\u00A0".repeat(4)}+ New`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a role</DialogTitle>
          <DialogDescription>
            Add a course role to manage and toggle permissions.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="Enter role name"
                    />
                  </FormControl>
                  <FormDescription>Edit the name of the role</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" disabled={pending}>
                  {`Creat${pending ? "ing..." : "e"}`}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
