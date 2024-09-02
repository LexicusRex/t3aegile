import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { useWarnIfUnsavedChanges } from "@/hooks/useWarnIfUnsavedChanges";
import { Alert, AlertTitle } from "@/components/ui/alert";

interface FloatingAlertProps {
  isDirty: boolean;
  children: React.ReactNode;
}

export const FloatingAlert = ({ isDirty, children }: FloatingAlertProps) => {
  const { navigationAttempted, resetNavigationAttempted } =
    useWarnIfUnsavedChanges(isDirty);

  useEffect(() => {
    if (navigationAttempted) {
      setTimeout(() => {
        resetNavigationAttempted();
      }, 2000);
    }
  }, [navigationAttempted, resetNavigationAttempted]);
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 transition-opacity duration-300",
        !isDirty ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <Alert
        className={cn(
          "w-full max-w-screen-lg p-3 transition-colors duration-300",
          navigationAttempted && "animate-shake",
        )}
        variant={navigationAttempted ? "destructive" : "default"}
      >
        <div className="flex items-end justify-between">
          <div>
            <AlertTitle
              className={cn(
                "text-base text-muted-foreground transition-colors duration-300",
                navigationAttempted && "text-red-400",
              )}
            >
              Careful - you have unsaved changes!
            </AlertTitle>
          </div>
          {children}
        </div>
      </Alert>
    </div>
  );
};
