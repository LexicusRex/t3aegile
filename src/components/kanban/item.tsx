import React from "react";

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import {
//   ComboboxAssignee,
//   SelectAssignee,
// } from "@/components/aegile/combobox-assignee";
// import { ComboboxDatepicker } from "@/components/aegile/combobox-datepicker/combobox-datepicker";
import { PriorityCombobox } from "@/components/combobox/priority";
import { StatusCombobox } from "@/components/combobox/status";

import { AssigneeCombobox } from "../combobox/assignee";

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  status?: string;
};

const Items = ({ id, title, status }: ItemsType) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "w-full rounded-md border bg-white px-3 py-3 hover:cursor-grab dark:bg-[#17181b]",
        isDragging
          ? "border-primary opacity-50"
          : "hover:bg-[#fbfbfb] hover:dark:bg-[#1a1c20]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...listeners}
    >
      <TooltipProvider>
        <div className="mb-1 flex items-center text-xs text-muted-foreground">
          <span>{id.toString().toUpperCase()}</span>{" "}
          {/* <span className="mx-1">›</span>
          <span className="line-clamp-1">
            Sub issue name that may go on very very long
          </span> */}
          <div className="ml-auto" onPointerDown={(e) => e.stopPropagation()}>
            <AssigneeCombobox isTask isIcon isActive={isHovered} />
            {/* <ComboboxAssignee
                  selectedAssignee={selectedAssignee}
                  setSelectedAssignee={setSelectedAssignee}
                  isIcon
                /> */}
          </div>
        </div>
        <div className="flex items-start text-sm">
          {/* {status && <status.icon className="mr-2 h-6 w-6" />} */}
          <div onPointerDown={(e) => e.stopPropagation()}>
            <StatusCombobox
              isTask
              isIcon
              isActive={isHovered}
              defaultStatus={status}
            />
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs font-medium">{title}</p>
          {/* <DragHandleDots2Icon
          className="w-4 h-4 text-muted cursor-grab"
        /> */}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          <div onPointerDown={(e) => e.stopPropagation()}>
            <PriorityCombobox isTask isIcon isActive={isHovered} />
          </div>
          <Tooltip>
            <TooltipTrigger asChild></TooltipTrigger>
            <TooltipContent>
              <p>Change Assignee</p>
            </TooltipContent>
          </Tooltip>
          {/* <ComboboxDatepicker /> */}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default Items;
