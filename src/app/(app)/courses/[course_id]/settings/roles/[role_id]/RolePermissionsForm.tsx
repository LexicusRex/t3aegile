"use client";

import { useTransition } from "react";

import { updateRolePermissionsAction } from "@/server/actions/roles";
import type { PermissionSlug } from "@/server/db/schema/permission";
import type { Role } from "@/server/db/schema/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import * as constants from "@/lib/constants";
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
import { Switch } from "@/components/ui/switch";
import { FloatingAlert } from "@/components/forms/floating-alert";

import permissionsSettingsFormStructure from "./permission-settings-form";

const rolesPermissionsFormSchema = z.object({
  // type: z.enum(["all", "mentions", "none"], {
  //   required_error: "You need to select a notification type.",
  // }),
  // mobile: z.boolean().default(false),
  [constants.PERM_COURSE_MANAGE_ENROLMENTS]: z.boolean().default(false),
  [constants.PERM_COURSE_MANAGE_CORE]: z.boolean().default(false),
  [constants.PERM_ROLE_MANAGE]: z.boolean().default(false),
  [constants.PERM_TUTORIAL_MANAGE_CORE]: z.boolean().default(false),
  [constants.PERM_TUTORIAL_MANAGE_ENROLMENTS]: z.boolean().default(false),
  [constants.PERM_TUTORIAL_VIEW]: z.boolean().default(false),
  [constants.PERM_GROUP_MANAGE_CORE]: z.boolean().default(false),
  [constants.PERM_GROUP_MANAGE_ENROLMENTS]: z.boolean().default(false),
  [constants.PERM_GROUP_MANAGE_SELF_ENROLMENT]: z.boolean().default(false),
  [constants.PERM_GROUP_VIEW]: z.boolean().default(false),
  [constants.PERM_ASSIGNMENT_MANAGE_CORE]: z.boolean().default(false),
  [constants.PERM_SUBMISSION_SUBMIT]: z.boolean().default(false),
  [constants.PERM_SUBMISSION_VIEW]: z.boolean().default(false),
  [constants.PERM_SUBMISSION_RESUBMIT]: z.boolean().default(false),
});

type RolesPermissionsFormValues = z.infer<typeof rolesPermissionsFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<RolesPermissionsFormValues> = {
  [constants.PERM_COURSE_MANAGE_ENROLMENTS]: false,
  [constants.PERM_COURSE_MANAGE_CORE]: false,
  [constants.PERM_ROLE_MANAGE]: false,
  [constants.PERM_TUTORIAL_MANAGE_CORE]: false,
  [constants.PERM_TUTORIAL_MANAGE_ENROLMENTS]: false,
  [constants.PERM_TUTORIAL_VIEW]: false,
  [constants.PERM_GROUP_MANAGE_CORE]: false,
  [constants.PERM_GROUP_MANAGE_ENROLMENTS]: false,
  [constants.PERM_GROUP_MANAGE_SELF_ENROLMENT]: false,
  [constants.PERM_GROUP_VIEW]: false,
  [constants.PERM_ASSIGNMENT_MANAGE_CORE]: false,
  [constants.PERM_SUBMISSION_SUBMIT]: false,
  [constants.PERM_SUBMISSION_VIEW]: false,
  [constants.PERM_SUBMISSION_RESUBMIT]: false,
};

export function RolesPermissionsForm({
  roleId,
  permissions,
}: {
  roleId: string;
  permissions: Record<PermissionSlug, boolean>;
}) {
  const [pending, startMutation] = useTransition();

  const form = useForm<RolesPermissionsFormValues>({
    resolver: zodResolver(rolesPermissionsFormSchema),
    defaultValues: { ...defaultValues, ...permissions },
    mode: "onChange",
  });

  function onSubmit(data: RolesPermissionsFormValues) {
    const dirtyFields = form.formState.dirtyFields;
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([key]) => dirtyFields[key as keyof RolesPermissionsFormValues],
      ),
    );

    const payload = {
      roleId,
      permissions: filteredData,
    };

    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(payload, null, 2)}</code>
      </pre>,
    );

    startMutation(async () => {
      const error = await updateRolePermissionsAction(payload);
      if (error) {
        toast.error(`Failed to update`, {
          description: error ?? "Error",
        });
      } else {
        form.reset(data);
        toast.success(`Role permissions updated!`);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8 pb-6">
          {permissionsSettingsFormStructure.map((section) => (
            <div key={section.name}>
              <h3 className="mb-2 text-sm font-medium">{section.name}</h3>
              <div className="space-y-4">
                {section.permissions.map((permission) => (
                  <FormField
                    key={permission.slug}
                    control={form.control}
                    name={permission.slug as keyof RolesPermissionsFormValues}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            {permission.name}
                          </FormLabel>
                          <FormDescription>
                            {permission.description}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
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
              {pending ? "Updating..." : "Update permissions"}
            </Button>
          </div>
        </FloatingAlert>
      </form>
    </Form>
  );
}
