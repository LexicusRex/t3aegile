import { AlertCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export default function GroupDragOverlay({
  isDraggingOverColumn,
  canOverlayBeVisible,
}: {
  isDraggingOverColumn: boolean;
  canOverlayBeVisible: boolean;
}) {
  const dropErrorMessage = "";
  const readableOrderBy = "priority";
  const shouldOverlayBeVisible = isDraggingOverColumn && canOverlayBeVisible;
  return (
    <div
      className={cn(
        `cubic-bezier(.36,.07,.19,.97) absolute left-0 top-0 flex h-full w-full flex-col items-center rounded bg-[#e8e8e8] text-sm transition-opacity duration-100 dark:bg-background/90`,
        //  ${dragColumnOrientation}`,
        {
          "z-[2] border-[1px] border-[#d5d5d5aa] opacity-90":
            shouldOverlayBeVisible,
        },
        { "opacity-0": !shouldOverlayBeVisible },
      )}
    >
      <div
        className={cn(
          "my-auto flex flex-col items-center rounded p-3",
          {
            "text-primary": shouldOverlayBeVisible,
          },
          // {
          //   "text-custom-text-error": isDropDisabled,
          // },
        )}
      >
        {dropErrorMessage ? (
          <div className="flex items-center">
            <AlertCircleIcon width={13} height={13} /> &nbsp;
            <span>{dropErrorMessage}</span>
          </div>
        ) : (
          <>
            {readableOrderBy && (
              <span className="text-base">
                Board ordered by{" "}
                <span className="font-semibold">{readableOrderBy}</span>.
              </span>
            )}
            <span>Drop here to move the task.</span>
          </>
        )}
      </div>
    </div>
  );
}
