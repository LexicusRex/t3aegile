import { capitalize } from "@/lib/utils";
import { useRouter } from "next/navigation";

import type { FieldValues, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

type Action = "create" | "update" | "delete";

interface UseHandleFormMutationProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  resource: string;
  closeDialog?: () => void;
  backpath?: string;
}

export function useHandleFormMutation<T extends FieldValues>({
  form,
  resource,
  closeDialog,
  backpath,
}: UseHandleFormMutationProps<T>) {
  const router = useRouter();

  const handleMutation = (action: Action, data?: T) => {
    return (error?: string) => {
      if (error) {
        toast.error(`Failed to ${action}`, {
          description: error ?? "Unspecified Error",
        });
      } else {
        form.reset(data);
        toast.success(`${capitalize(resource)} ${action}d successfully!`);
        if (closeDialog) closeDialog();
        router.refresh();
        if (action === "delete" && backpath) router.push(backpath);
      }
    };
  };

  return handleMutation;
}
