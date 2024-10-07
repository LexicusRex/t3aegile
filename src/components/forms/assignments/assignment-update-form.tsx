"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateAssignmentAction } from "@/server/actions/assignments";
import {
  updateAssignmentParams,
  type Assignment,
} from "@/server/db/schema/assignment";
import { zodResolver } from "@hookform/resolvers/zod";
// import { PencilIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DateTimeFormPicker } from "@/components/date-time-picker/form/date-time-picker";
import { FloatingAlert } from "@/components/forms/floating-alert";

interface AssignmentUpdateFormProps {
  assignment: Assignment;
  // editing: boolean;
}

type AssignmentUpdateFormValues = z.infer<typeof updateAssignmentParams>;

export default function AssignmentUpdateForm({
  assignment,
  // editing,
}: AssignmentUpdateFormProps) {
  const [pending, startMutation] = useTransition();
  const router = useRouter();

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
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <div className="grid w-full grid-cols-[auto_1fr] gap-x-6">
          <div className="flex min-h-8 items-start py-2 text-xs font-medium text-muted-foreground">
            Name
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl className="flex min-h-8 items-start rounded-md p-2 text-xs font-light transition-colors duration-300 hover:bg-accent">
                  <Input
                    type="text"
                    {...field}
                    placeholder="Assignment Title"
                    className="flex h-8 border-none text-xs font-light shadow-none focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex min-h-8 items-start py-2 text-xs font-medium text-muted-foreground">
            Weighting (%)
          </div>
          <FormField
            control={form.control}
            name="weighting"
            render={({ field }) => (
              <FormItem>
                <FormControl className="flex min-h-8 items-start rounded-md p-2 text-xs font-light transition-colors duration-300 hover:bg-accent">
                  <Input
                    type="number"
                    {...field}
                    placeholder="15"
                    className="flex h-8 border-none text-xs font-light shadow-none focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex min-h-8 items-start py-2 text-xs font-medium text-muted-foreground">
            Available At
          </div>
          <FormField
            control={form.control}
            name="availableAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <DateTimeFormPicker
                  field={field}
                  className="h-8 border-none px-2 text-xs font-light"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex min-h-8 items-start py-2 text-xs font-medium text-muted-foreground">
            Tags
          </div>
          <div className="flex h-8 items-start rounded-md p-2 text-xs font-light transition-colors duration-300 hover:bg-accent">
            Empty
          </div>

          <div className="min-h-8 items-start py-2 text-xs font-medium text-muted-foreground">
            Groups
          </div>
          <FormField
            control={form.control}
            name="isGroup"
            render={({ field }) => (
              <FormItem>
                <FormControl className="">
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        form.setValue("isSelfEnrol", false);
                        form.setValue("isTutorialGrouping", false);
                      }
                      field.onChange(checked);
                    }}
                    className="m-2 self-start"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={cn(
              "min-h-8 items-start py-2 text-xs font-medium text-muted-foreground",
              !form.getValues("isGroup") && "text-muted-foreground/50",
            )}
          >
            Self-enrol
          </div>
          <FormField
            control={form.control}
            name="isSelfEnrol"
            render={({ field }) => (
              <FormItem>
                <FormControl className="">
                  <Switch
                    checked={form.getValues("isGroup") && field.value}
                    onCheckedChange={field.onChange}
                    className="m-2 self-start"
                    disabled={!form.getValues("isGroup")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={cn(
              "min-h-8 items-start py-2 text-xs font-medium text-muted-foreground",
              !form.getValues("isGroup") && "text-muted-foreground/50",
            )}
          >
            Tutorial Grouping
          </div>
          <FormField
            control={form.control}
            name="isTutorialGrouping"
            render={({ field }) => (
              <FormItem>
                <FormControl className="">
                  <Switch
                    checked={form.getValues("isGroup") && field.value}
                    onCheckedChange={field.onChange}
                    className="m-2 self-start"
                    disabled={!form.getValues("isGroup")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            className={cn(
              "min-h-8 items-start py-2 text-xs font-medium text-muted-foreground",
              !form.getValues("isGroup") && "text-muted-foreground/50",
            )}
          >
            Team Size
          </div>
          <FormField
            control={form.control}
            name="maxGroupSize"
            render={({ field }) => (
              <FormItem>
                <FormControl className="flex min-h-8 items-start rounded-md p-2 text-xs font-light transition-colors duration-300 hover:bg-accent">
                  <Input
                    type="number"
                    {...field}
                    placeholder="5"
                    disabled={!form.getValues("isGroup")}
                    className="flex h-8 border-none text-xs font-light shadow-none focus-visible:ring-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
