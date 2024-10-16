"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useHotkeys } from "@/hooks/use-hot-keys";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CheckIcon } from "./icons/check";
import { HighIcon } from "./icons/high";
import { LowIcon } from "./icons/low";
import { MediumIcon } from "./icons/medium";
import { NoPriorityIcon } from "./icons/no-priority";
import type { SVGRProps } from "./icons/types";
import { UrgentIcon } from "./icons/urgent";

type Priority = {
  value: (typeof priorities)[number]["value"];
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & SVGRProps>;
};

const priorities = [
  { value: "no-priority", label: "No priority", icon: NoPriorityIcon },
  { value: "urgent", label: "Urgent", icon: UrgentIcon },
  { value: "high", label: "High", icon: HighIcon },
  { value: "medium", label: "Medium", icon: MediumIcon },
  { value: "low", label: "Low", icon: LowIcon },
] as const;

export const PriorityCombobox = ({
  isActive,
  isTask = false,
  isIcon = false,
}: {
  isActive: boolean;
  isTask?: boolean;
  isIcon?: boolean;
}) => {
  const [openPopover, setOpenPopover] = React.useState(false);
  const [openTooltip, setOpenTooltip] = React.useState(false);

  const [selectedPriority, setSelectedPriority] = React.useState<
    Priority | undefined
  >(undefined);

  const [searchValue, setSearchValue] = React.useState("");

  const isSearching = searchValue.length > 0;

  useHotkeys(
    [
      [
        "p",
        () => {
          setOpenTooltip(false);
          setOpenPopover(true);
        },
      ],
    ],
    isActive,
  );

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <Tooltip
        delayDuration={500}
        open={openTooltip}
        onOpenChange={setOpenTooltip}
      >
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              aria-label="Set priority"
              variant="outline"
              size="sm"
              className={cn(
                "h-6 w-fit px-2 text-xs font-normal leading-normal text-primary dark:border-[#383b41] dark:bg-[#292c33]",
                isTask && "dark:bg-transparent",
                isIcon && "m-0 h-[22px] w-[22px] p-[2px]",
              )}
              // onPointerDown={(e) => e.stopPropagation()}
            >
              {selectedPriority && selectedPriority.value !== "no-priority" ? (
                <>
                  <selectedPriority.icon
                    className={cn(
                      "mr-1 size-4",
                      selectedPriority.value !== "urgent" && "fill-primary",
                      isIcon && "m-0",
                    )}
                    aria-hidden="true"
                    title={selectedPriority.label}
                  />
                  {!isIcon && selectedPriority.label}
                </>
              ) : (
                <>
                  <NoPriorityIcon
                    className={cn("mr-1 size-4 fill-primary", isIcon && "m-0")}
                    aria-hidden="true"
                    title="Set priority"
                  />
                  {!isIcon && "Priority"}
                </>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent
          hideWhenDetached
          // side="bottom"
          // align="start"
          // sideOffset={6}
          className="flex h-8 items-center gap-2 px-2 text-xs"
        >
          <span>Change priority</span>
          <Kbd>P</Kbd>
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        className="w-[206px] rounded-lg p-0"
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        sideOffset={6}
      >
        <Command className="rounded-lg">
          <span className="flex items-center">
            <CommandInput
              value={searchValue}
              onValueChange={(searchValue) => {
                // If the user types a number, select the priority like useHotkeys
                if ([0, 1, 2, 3, 4].includes(Number.parseInt(searchValue))) {
                  setSelectedPriority(priorities[Number.parseInt(searchValue)]);
                  setOpenTooltip(false);
                  setOpenPopover(false);
                  setSearchValue("");
                  return;
                }
                setSearchValue(searchValue);
              }}
              className="text-[0.8125rem] leading-normal"
              placeholder="Set priority..."
            />
            <span className="absolute right-2">
              {!isSearching && <Kbd>P</Kbd>}
            </span>
          </span>
          <CommandList>
            <CommandGroup>
              {priorities.map((priority, index) => (
                <CommandItem
                  key={priority.value}
                  value={priority.value}
                  onSelect={(value) => {
                    setSelectedPriority(
                      priorities.find((p) => p.value === value),
                    );
                    setOpenTooltip(false);
                    setOpenPopover(false);
                    setSearchValue("");
                  }}
                  className="group flex w-full items-center justify-between rounded-md text-[0.8125rem] leading-normal text-primary"
                >
                  <div className="flex items-center">
                    <priority.icon
                      title={priority.label}
                      className="mr-2 size-4 fill-muted-foreground group-hover:fill-primary"
                    />
                    <span>{priority.label}</span>
                  </div>
                  <div className="flex items-center">
                    {selectedPriority?.value === priority.value && (
                      <CheckIcon
                        title="Check"
                        className="mr-3 size-4 fill-muted-foreground group-hover:fill-primary"
                      />
                    )}
                    {!isSearching && <span className="text-xs">{index}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
