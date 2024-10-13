import * as React from "react";

import {
  bulkDeleteTutorialEnrolmentAction,
  bulkInsertTutorialEnrolmentAction,
} from "@/server/actions/tutorials";
import type { CourseParticipant } from "@/server/api/crud/course-enrolments/types";
import type { TutorialCore } from "@/server/db/schema/tutorial";
import type { Row } from "@tanstack/react-table";
import { CheckIcon, EditIcon, MinusIcon, PlusIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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

interface TutorialMultiSelectProps {
  courseId: string;
  selectedRows: Row<CourseParticipant>[];
  allTutorials: TutorialCore[];
}

export function TutorialMultiSelect({
  courseId,
  selectedRows,
  allTutorials,
}: TutorialMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [original, setOriginal] = React.useState<string[]>([]);
  const [added, setAdded] = React.useState<string[]>([]);
  const [deleted, setDeleted] = React.useState<string[]>([]);
  const [isDirty, setIsDirty] = React.useState(false);

  // Calculate the intersection of tutorials from selected rows
  React.useEffect(() => {
    setSelected([]);
    setAdded([]);
    setDeleted([]);
    if (selectedRows.length > 0) {
      const intersectionTutorials = selectedRows.reduce<string[]>(
        (acc, row, index) => {
          const tutorials: string[] = row.getValue("tutorials");
          if (index === 0) return tutorials;
          return acc.filter((tutorial) => tutorials.includes(tutorial));
        },
        [],
      );
      setSelected(intersectionTutorials);
      setOriginal(intersectionTutorials);
    } else {
      setSelected([]);
      setOriginal([]);
    }
  }, [selectedRows]);

  const handleSelect = React.useCallback(
    (tutorialName: string) => {
      if (deleted.includes(tutorialName)) {
        setDeleted((prev) => prev.filter((t) => t !== tutorialName));
        if (original.includes(tutorialName)) {
          setSelected((prev) => [...prev, tutorialName]);
        }
      } else if (!original.includes(tutorialName)) {
        setAdded((prev) => [...prev, tutorialName]);
      } else {
        setSelected((prev) => [...prev, tutorialName]);
      }
      setIsDirty(true);
    },
    [deleted, original],
  );

  const handleUnselect = React.useCallback(
    (tutorialName: string) => {
      if (original.includes(tutorialName)) {
        setDeleted((prev) => [...prev, tutorialName]);
        setSelected((prev) => prev.filter((s) => s !== tutorialName));
      } else {
        setAdded((prev) => prev.filter((a) => a !== tutorialName));
      }
      setIsDirty(true);
    },
    [original],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const lastSelected = [...selected, ...added].pop();
            if (lastSelected) {
              handleUnselect(lastSelected);
            }
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [selected, added, handleUnselect],
  );

  const selectables = React.useMemo(() => {
    return allTutorials.map((tutorial) => {
      const count = selectedRows.filter((row) => {
        const tutorials: string[] = row.getValue("tutorials");
        return tutorials.includes(tutorial.name);
      }).length;
      return {
        ...tutorial,
        partiallySelected: count > 0 && count < selectedRows.length,
      };
    });
  }, [allTutorials, selectedRows]);

  const getChangedTutorials = React.useCallback(() => {
    // const addedTutorials = added
    //   .map((name) => allTutorials.find((t) => t.name === name)!)
    //   .filter(Boolean);
    // const removedTutorials = deleted
    //   .map((name) => allTutorials.find((t) => t.name === name)!)
    //   .filter(Boolean);
    // return { added: addedTutorials, removed: removedTutorials };

    const addedTutorials = added
      .map((name) => allTutorials.find((t) => t.name === name)!)
      .filter(Boolean);
    const removedTutorials = deleted
      .map((name) => allTutorials.find((t) => t.name === name)!)
      .filter(Boolean);

    const changes = {
      added: [] as { userId: string; tutorialId: string; courseId: string }[],
      removed: [] as { userId: string; tutorialId: string; courseId: string }[],
    };

    selectedRows.forEach((row) => {
      const userId = row.original.id;
      const userTutorials: string[] = row.getValue("tutorials");

      addedTutorials.forEach((tutorial) => {
        if (!userTutorials.includes(tutorial.name)) {
          changes.added.push({ userId, tutorialId: tutorial.id, courseId });
        }
      });

      removedTutorials.forEach((tutorial) => {
        if (userTutorials.includes(tutorial.name)) {
          changes.removed.push({ userId, tutorialId: tutorial.id, courseId });
        }
      });
    });

    return changes;
  }, [added, deleted, selectedRows, allTutorials, courseId]);

  const currentlySelected = React.useMemo(
    () => [...selected, ...added, ...deleted],
    [selected, added, deleted],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          className="flex h-fit min-h-8 w-full items-center py-3"
        >
          {currentlySelected.length > 0 ? (
            <>
              {/* <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selected.length}
              </Badge> */}

              <div className="flex w-full flex-wrap gap-1">
                {
                  // selected.length > 2 ? (
                  //   <Badge
                  //     variant="secondary"
                  //     className="rounded-sm px-1 font-normal"
                  //   >
                  //     {selected.length} selected
                  //   </Badge>
                  // ) : (
                  selected.map((tutorialName) => (
                    <Badge
                      key={tutorialName}
                      variant="outline"
                      className="bg-secondary"
                    >
                      <span className="line-clamp-1">{tutorialName}</span>
                    </Badge>
                  ))
                  // )
                }
                {added.map((tutorialName) => (
                  <Badge
                    key={tutorialName}
                    variant="secondary"
                    className="border-green-500/20 bg-green-500/10 [&>*]:text-green-600 dark:[&>*]:text-green-400"
                  >
                    <span className="line-clamp-1">+ {tutorialName}</span>
                  </Badge>
                ))}
                {deleted.map((tutorialName) => (
                  <Badge
                    key={tutorialName}
                    variant="secondary"
                    className="border-red-500/20 bg-red-500/10 [&>*]:text-red-600 dark:[&>*]:text-red-400"
                  >
                    <span className="line-clamp-1">- {tutorialName}</span>
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Select Tutorials</p>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command
          onKeyDown={handleKeyDown}
          className="overflow-visible bg-transparent"
        >
          <CommandInput placeholder="Select tutorials..." />
          <CommandList>
            <CommandEmpty>No tutorials...</CommandEmpty>
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((tutorial) => {
                const isSelected = selected.includes(tutorial.name);
                const isAdded = added.includes(tutorial.name);
                const isToBeDeleted = deleted.includes(tutorial.name);
                return (
                  <CommandItem
                    key={tutorial.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      isSelected || isAdded
                        ? handleUnselect(tutorial.name)
                        : handleSelect(tutorial.name);
                      setIsDirty(true);
                    }}
                    className={"cursor-pointer"}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary [&_svg]:invisible",
                        isSelected
                          ? "bg-primary text-primary-foreground [&_svg]:visible"
                          : tutorial.partiallySelected
                            ? "[&_svg]:visible"
                            : null,
                        isAdded
                          ? "border-green-500/50 bg-green-500/10 opacity-100 [&>*]:text-green-600 dark:[&>*]:text-green-400 [&_svg]:visible"
                          : null,
                        isToBeDeleted
                          ? "border-red-500/50 bg-red-500/10 [&>*]:text-red-600 dark:[&>*]:text-red-400 [&_svg]:visible"
                          : null,
                      )}
                    >
                      {isToBeDeleted ? (
                        <XIcon className="h-4 w-4 text-destructive" />
                      ) : isAdded ? (
                        <PlusIcon className="h-4 w-4 text-green-400" />
                      ) : tutorial.partiallySelected ? (
                        <MinusIcon className="h-4 w-4" />
                      ) : (
                        <CheckIcon className={cn("h-4 w-4")} />
                      )}
                    </div>
                    {tutorial.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      {/* <FloatingAlert isDirty={isDirty}>
        <div className="flex items-center gap-x-2">
          <Button
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => {
              setSelected(original);
              setDeleted([]);
              setIsDirty(false);
            }}
          >
            Reset
          </Button>
          </div>
          </FloatingAlert> */}
      <Button
        variant="default"
        className="mt-2 h-8 w-full text-xs"
        onClick={async () => {
          const { added, removed } = getChangedTutorials();
          toast(
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                +++ {JSON.stringify(added, null, 2)}
              </code>
              <br />
              <br />
              <code className="text-white">
                --- {JSON.stringify(removed, null, 2)}
              </code>
            </pre>,
          );
          await bulkDeleteTutorialEnrolmentAction({
            courseId,
            enrolments: removed,
          });
          const insertError = await bulkInsertTutorialEnrolmentAction({
            courseId,
            enrolments: added,
          });

          insertError
            ? toast.error(`Failed to enrol`, {
                description: insertError ?? "Error",
              })
            : toast.success(`Enrolled successfully!`);

          // Here you would typically call an API to update the tutorials
          setIsDirty(false);
        }}
      >
        <EditIcon className="mr-1 h-4 w-4" />
        Update {selectedRows.length} row(s)
      </Button>
    </Popover>
  );
}
