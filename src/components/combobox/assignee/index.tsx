"use client";

import * as React from "react";
import Image from "next/image";

import { CircleUserIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useHotkeys } from "@/hooks/use-hot-keys";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Icons } from "@/components/icons";

import { Kbd } from "@/components/ui/kbd";
import { assignees } from "./data";
import type { TIssueAssignee } from "./types";

export const AssigneeCombobox = ({
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

  const [selectedAssignee, setSelectedAssignee] = React.useState<
    TIssueAssignee | undefined
  >(undefined);

  const [searchValue, setSearchValue] = React.useState("");

  const isSearching = searchValue.length > 0;

  useHotkeys(
    [
      [
        "a",
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
              variant="ghost"
              size="sm"
              className={cn(
                "h-6 w-fit px-2 text-xs font-normal leading-normal text-primary dark:border-[#383b41] dark:bg-[#292c33]",
                isTask && "dark:bg-transparent",
                isIcon && "m-0 h-[22px] w-[22px] p-[2px]",
              )}
              // onPointerDown={(e) => e.stopPropagation()}
            >
              {!selectedAssignee ? (
                <div className="flex">
                  <Icons.unassigned
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 text-muted-foreground",
                      !isIcon && "mr-2",
                    )}
                  />
                  {!isIcon && <span className="text-xs">Assignee</span>}
                </div>
              ) : (
                <>
                  <Avatar
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 rounded-full text-muted-foreground",
                      !isIcon && "mr-2",
                    )}
                  >
                    <AvatarImage src={selectedAssignee.image} />
                    <AvatarFallback>
                      <CircleUserIcon className="text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  {!isIcon && (
                    <span className="text-xs">{selectedAssignee.name}</span>
                  )}
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
          <span>Assign to...</span>
          <Kbd>A</Kbd>
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
              id={searchValue}
              onValueChange={(searchValue) => setSearchValue(searchValue)}
              className="text-[0.8125rem] leading-normal"
              placeholder="Assign to..."
            />
            <span className="absolute right-2">
              {!isSearching && <Kbd>A</Kbd>}
            </span>
          </span>
          <CommandList>
            <CommandGroup>
              <CommandItem
                value="no assignee"
                onSelect={(value) => {
                  setSelectedAssignee(undefined);
                  setOpenTooltip(false);
                  setOpenPopover(false);
                }}
              >
                <Icons.unassigned className="mr-2 h-[18px] w-[18px] text-muted-foreground" />
                <span className="text-xs">No Assignee</span>
                {!selectedAssignee && <span className="ml-auto">✓</span>}
              </CommandItem>
              {assignees.map((assignee, index) => (
                <CommandItem
                  key={assignee.id}
                  value={assignee.id}
                  onSelect={(value) => {
                    setSelectedAssignee(assignees.find((p) => p.id === value));
                    setOpenTooltip(false);
                    setOpenPopover(false);
                    setSearchValue("");
                  }}
                  className="group flex w-full items-center justify-between rounded-md text-xs leading-normal text-primary"
                >
                  <div className="flex w-full items-center">
                    {assignee.image ? (
                      <Avatar
                        className={cn(
                          "mr-2 h-[18px] w-[18px] shrink-0 rounded-full text-muted-foreground",
                        )}
                      >
                        <AvatarImage
                          src={assignee.image}
                          // className="mr-2 h-[18px] w-[18px] text-muted-foreground rounded-full"
                          className="h-[18px] w-[18px] fill-muted-foreground group-hover:fill-primary"
                          alt={`${assignee.name}'s user avatar`}
                        />
                        <AvatarFallback>
                          <CircleUserIcon />
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <CircleUserIcon className="mr-2 h-[18px] w-[18px] text-muted-foreground" />
                    )}
                    <span>{assignee.name}</span>
                    {selectedAssignee?.id === assignee.id && (
                      <span className="ml-auto">✓</span>
                    )}
                  </div>
                  {/* {selectedAssignee?.id === assignee.id && (
                      <Icons.check className="ml-auto size-4 fill-muted-foreground group-hover:fill-primary" />
                    )} */}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
