"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { updateRolePermissionsAction } from "@/server/actions/roles";
import type { PermissionSlug } from "@/server/db/schema/permission";
import { updateRoleAndPermissionsParams } from "@/server/db/schema/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { permissionsList } from "@/lib/constants";
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
import { Switch } from "@/components/ui/switch";
import { FloatingAlert } from "@/components/forms/floating-alert";

import permissionsSettingsFormStructure from "./permission-settings-form";

type RoleAndPermissionsFormValues = z.infer<
  typeof updateRoleAndPermissionsParams
>;

// Update the form to use the combined schema
export function RolesPermissionsForm({
  courseId,
  role,
  permissions,
}: {
  courseId: string;
  role: { id: string; name: string; isCourseDefault: boolean };
  permissions: Record<PermissionSlug, boolean>;
}) {
  const router = useRouter();

  const [pending, startMutation] = useTransition();
  const defaultPermissions = Object.fromEntries(
    permissionsList.map((permission) => [
      permission,
      permissions[permission] ?? false,
    ]),
  );
  const form = useForm<RoleAndPermissionsFormValues>({
    resolver: zodResolver(updateRoleAndPermissionsParams),
    defaultValues: {
      courseId,
      ...role,
      permissions: defaultPermissions as Record<PermissionSlug, boolean>,
    },
    mode: "onChange",
  });

  function onSubmit(data: RoleAndPermissionsFormValues) {
    const dirtyPermissions = form.formState.dirtyFields.permissions;
    const payload = {
      ...data,
      permissions: Object.fromEntries(
        Object.entries(data.permissions).filter(
          ([key]) => dirtyPermissions?.[key as PermissionSlug],
        ),
      ),
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
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8 pb-12">
          <div className="space-y-6">
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
            <FormField
              control={form.control}
              name="isCourseDefault"
              render={({ field }) => {
                const isDisabled = role.isCourseDefault;
                return (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel
                        className={isDisabled ? "text-muted-foreground" : ""}
                      >
                        Set as Course Default
                      </FormLabel>
                      <FormDescription>
                        {isDisabled
                          ? "Current default role cannot be disabled. Please enable a different role."
                          : "Set this role as the course default."}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                        disabled={isDisabled}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
          <Separator />
          {permissionsSettingsFormStructure.map((section) => (
            <div key={section.name}>
              <h3 className="mb-2 text-sm font-medium">{section.name}</h3>
              <div className="space-y-4">
                {section.permissions.map((permission) => (
                  <FormField
                    key={permission.slug}
                    control={form.control}
                    name={
                      `permissions.${permission.slug}` as keyof RoleAndPermissionsFormValues
                    }
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>{permission.name}</FormLabel>
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
