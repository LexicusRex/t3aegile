"use client";

import { useEffect } from "react";
import Link from "next/link";

import type { PermissionSlug } from "@/server/db/schema/permission";
import type { Role } from "@/server/db/schema/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import * as constants from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

const permissionFields = [
  {
    name: "Manage Core Course Settings",
    slug: "course:manage-core",
    description:
      "Allow the role to edit course details, status, offering, dates and delete courses.",
  },
];

export function RolesPermissionsForm({
  role,
  permissions,
}: {
  role?: Role;
  permissions: Record<PermissionSlug, boolean>;
}) {
  const form = useForm<RolesPermissionsFormValues>({
    resolver: zodResolver(rolesPermissionsFormSchema),
    defaultValues: { ...defaultValues, ...permissions },
    mode: "onChange",
  });

  function onSubmit(data: RolesPermissionsFormValues) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );
  }

  useEffect(() => {
    console.log("🚀 ~ form.formState:", form.formState);
  }, [form.formState]);

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
            <Button type="submit">Update permissions</Button>
          </div>
        </FloatingAlert>
      </form>
    </Form>
  );
}
// pre-action
// defaultValues: Object { "tutorial:view": true, "tutorial:manage-enrolments": true, "tutorial:manage-core": true }
// dirtyFields: Object {  }
// isDirty: false

// toggle manage course enrolments on
// defaultValues: Object { "tutorial:view": true, "tutorial:manage-enrolments": true, "tutorial:manage-core": true }
//   "tutorial:manage-core": true
//   "tutorial:manage-enrolments": true
//   "tutorial:view": true
// dirtyFields: Object { "course:manage-enrolments": true }
// isDirty: true

// form reset
