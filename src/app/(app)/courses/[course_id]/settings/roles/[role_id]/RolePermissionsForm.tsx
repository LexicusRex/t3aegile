"use client";

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

import permissionsSettingsFormStructure from "./permission-settings-form";

const rolesPermissionsFormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  mobile: z.boolean().default(false).optional(),
  [constants.PERM_COURSE_MANAGE_ENROLMENTS]: z
    .boolean()
    .default(false)
    .optional(),
  [constants.PERM_COURSE_MANAGE_CORE]: z.boolean().default(false).optional(),
  [constants.PERM_ROLE_MANAGE]: z.boolean().default(false).optional(),
  [constants.PERM_TUTORIAL_MANAGE_CORE]: z.boolean().default(false).optional(),
  [constants.PERM_TUTORIAL_MANAGE_ENROLMENTS]: z
    .boolean()
    .default(false)
    .optional(),
  [constants.PERM_TUTORIAL_VIEW]: z.boolean().default(false).optional(),
  [constants.PERM_GROUP_MANAGE_CORE]: z.boolean().default(false).optional(),
  [constants.PERM_GROUP_MANAGE_ENROLMENTS]: z
    .boolean()
    .default(false)
    .optional(),
  [constants.PERM_GROUP_MANAGE_SELF_ENROLMENT]: z
    .boolean()
    .default(false)
    .optional(),
  [constants.PERM_GROUP_VIEW]: z.boolean().default(false).optional(),
  [constants.PERM_ASSIGNMENT_MANAGE_CORE]: z
    .boolean()
    .default(false)
    .optional(),
  [constants.PERM_SUBMISSION_SUBMIT]: z.boolean().default(false).optional(),
  [constants.PERM_SUBMISSION_VIEW]: z.boolean().default(false).optional(),
  [constants.PERM_SUBMISSION_RESUBMIT]: z.boolean().default(false).optional(),
});

type RolesPermissionsFormValues = z.infer<typeof rolesPermissionsFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<RolesPermissionsFormValues> = {
  // communication_emails: false,
  // marketing_emails: false,
  // social_emails: true,
  // security_emails: true,
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
    defaultValues: permissions,
  });

  function onSubmit(data: RolesPermissionsFormValues) {
    toast(
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>,
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Notify me about...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="all" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      All new messages
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="mentions" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Direct messages and mentions
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="none" />
                    </FormControl>
                    <FormLabel className="font-normal">Nothing</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-8">
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
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Use different settings for my mobile devices
                </FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the{" "}
                  <Link href="/examples/forms">mobile settings</Link> page.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit">Update permissions</Button>
      </form>
    </Form>
  );
}
