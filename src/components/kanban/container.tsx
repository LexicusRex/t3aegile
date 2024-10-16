import React from "react";

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { PlusIcon, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import GroupDragOverlay from "../fancy-kanban/group-drag-overlay";

// import { TaskCreationDialog } from "@/components/aegile/task-creation-dialog";

interface ContainerProps {
  id: UniqueIdentifier;
  children?: React.ReactNode;
  title?: string;
  status?: { icon: LucideIcon; color?: string };
  isOverlayVisible?: boolean;
  onAddItem?: () => void;
  isOverlay?: boolean;
}

const Container = ({
  id,
  children,
  title,
  status,
  isOverlayVisible = false,
  // onAddItem,
  isOverlay = false,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "container",
    },
  });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        !isOverlay &&
          "bg-gradient-to-b from-[#f5f5f5] to-[#fbfbfb] dark:from-[#0e0e0f] dark:to-[#0f0f11]",
        "rounded-lgpy-3 relative flex h-full w-60 shrink-0 grow cursor-default flex-col gap-y-4 pl-3 sm:w-[340px]",
        // children ? "h-full" : "h-full",
        isDragging && "border border-primary opacity-50",
      )}
    >
      <GroupDragOverlay
        isDraggingOverColumn={isOverlayVisible}
        canOverlayBeVisible={isOverlayVisible}
      />
      <TooltipProvider>
        <div
          className={clsx(
            "mt-2 flex items-center justify-between rounded-md",
            isOverlay && "border border-gray-50 p-4",
          )}
        >
          <div className="z-[3] flex items-center gap-y-1">
            {/* <DragHandleDots2Icon
              className="h-5 w-5 cursor-grab text-muted"
              {...listeners}
            /> */}
            {status && <status.icon className="mr-2 h-4 w-4" {...listeners} />}
            <h1 className="truncate text-sm font-semibold">{title}</h1>
          </div>
          <div className="z-[3] flex gap-x-2 pr-3">
            <Tooltip>
              <TooltipTrigger>
                {/* <TaskCreationDialog> */}
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-1"
                  // onClick={onAddItem}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
                {/* </TaskCreationDialog> */}
              </TooltipTrigger>
              <TooltipContent>
                <p>New Item</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-1"
                >
                  <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>List options</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        {children}
      </TooltipProvider>
    </div>
  );
};

export default Container;
