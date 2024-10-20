import * as React from "react";

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

interface SelectableItem {
  id: string;
  name: string;
}

interface GenericMultiSelectProps<TSchema> {
  selectedRows: Row<TSchema>[];
  allItems: SelectableItem[];
  onUpdate?: (
    added: string[], // IDs
    removed: string[], // IDs
    rows: Row<TSchema>[],
  ) => Promise<void>;
  getItemsFromRow: (row: Row<TSchema>) => string[];
  isSingleSelect?: boolean;
}

export function DataTableMultiSelect<TSchema>({
  selectedRows,
  allItems,
  onUpdate,
  getItemsFromRow,
  isSingleSelect,
}: GenericMultiSelectProps<TSchema>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [original, setOriginal] = React.useState<string[]>([]);
  const [added, setAdded] = React.useState<string[]>([]);
  const [deleted, setDeleted] = React.useState<string[]>([]);
  const [isDirty, setIsDirty] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);

  // Calculate the intersection of items from selected rows
  React.useEffect(() => {
    setSelected([]);
    setAdded([]);
    setDeleted([]);
    if (selectedRows.length > 0) {
      const intersectionItems = selectedRows.reduce<string[]>(
        (acc, row, index) => {
          const items: string[] = getItemsFromRow(row);
          if (index === 0) return items;
          return acc.filter((item) => items.includes(item));
        },
        [],
      );
      setSelected(intersectionItems);
      setOriginal(intersectionItems);
    } else {
      setSelected([]);
      setOriginal([]);
    }
  }, [selectedRows, getItemsFromRow]);

  const handleSelect = React.useCallback(
    (itemName: string) => {
      if (deleted.includes(itemName)) {
        setDeleted((prev) => prev.filter((t) => t !== itemName)); // remove it from deleted
        if (original.includes(itemName)) {
          // reselecting something in original
          setSelected((prev) => [...prev, itemName]);
          if (isSingleSelect) setAdded([]);
        }
      } else if (!original.includes(itemName)) {
        if (isSingleSelect) {
          setDeleted([...original]);
          setSelected([]);
          setAdded([]);
        }
        setAdded((prev) => [...prev, itemName]);
      } else {
        if (isSingleSelect) {
          setAdded([]);
          setDeleted([]);
        }
        setSelected((prev) => [...prev, itemName]);
      }
      setIsDirty(true);
    },
    [deleted, isSingleSelect, original],
  );

  const handleUnselect = React.useCallback(
    (itemName: string) => {
      if (original.includes(itemName)) {
        setDeleted((prev) => [...prev, itemName]);
        setSelected((prev) => prev.filter((s) => s !== itemName));
      } else {
        setAdded((prev) => prev.filter((a) => a !== itemName));
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
    setIsDisabled(false);
    return allItems.map((item) => {
      const count = selectedRows.filter((row) => {
        const items: string[] = getItemsFromRow(row);
        return items.includes(item.name);
      }).length;
      const isPartialSelect = count > 0 && count < selectedRows.length;

      if (isSingleSelect && isPartialSelect) setIsDisabled(true);

      return {
        ...item,
        partiallySelected: count > 0 && count < selectedRows.length,
      };
    });
  }, [allItems, selectedRows, isSingleSelect, getItemsFromRow]);

  const getChangedItems = React.useCallback(() => {
    const addedItems = added
      .map((name) => allItems.find((t) => t.name === name)!.id)
      .filter(Boolean);
    const removedItems = deleted
      .map((name) => allItems.find((t) => t.name === name)!.id)
      .filter(Boolean);

    return { added: addedItems, removed: removedItems };
  }, [added, deleted, allItems]);

  const currentlySelected = React.useMemo(
    () => [...selected, ...added, ...deleted],
    [selected, added, deleted],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex h-fit min-h-8 w-full items-center py-2"
          disabled={isDisabled}
        >
          {currentlySelected.length > 0 ? (
            <div className="flex w-full flex-wrap gap-1">
              {selected.map((itemName) => (
                <Badge
                  key={itemName}
                  variant="outline"
                  className="bg-secondary"
                >
                  <span className="line-clamp-1">{itemName}</span>
                </Badge>
              ))}
              {added.map((itemName) => (
                <Badge
                  key={itemName}
                  variant="secondary"
                  className="border-green-500/20 bg-green-500/10 [&>*]:text-green-600 dark:[&>*]:text-green-400"
                >
                  <span className="line-clamp-1">+ {itemName}</span>
                </Badge>
              ))}
              {deleted.map((itemName) => (
                <Badge
                  key={itemName}
                  variant="secondary"
                  className="border-red-500/20 bg-red-500/10 [&>*]:text-red-600 dark:[&>*]:text-red-400"
                >
                  <span className="line-clamp-1">- {itemName}</span>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Select Items</p>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command
          onKeyDown={handleKeyDown}
          className="overflow-visible bg-transparent"
        >
          <CommandInput placeholder="Select items..." />
          <CommandList>
            <CommandEmpty>No items...</CommandEmpty>
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((item) => {
                const isSelected = selected.includes(item.name);
                const isAdded = added.includes(item.name);
                const isToBeDeleted = deleted.includes(item.name);
                return (
                  <CommandItem
                    key={item.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      isSelected || isAdded
                        ? handleUnselect(item.name)
                        : handleSelect(item.name);
                      setIsDirty(true);
                    }}
                    className={"cursor-pointer"}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center border border-primary [&_svg]:invisible",
                        isSingleSelect ? "rounded-full" : "rounded-sm",
                        isSelected
                          ? "bg-primary text-primary-foreground [&_svg]:visible"
                          : item.partiallySelected
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
                      ) : item.partiallySelected ? (
                        <MinusIcon className="h-4 w-4" />
                      ) : (
                        <CheckIcon className={cn("h-4 w-4")} />
                      )}
                    </div>
                    {item.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      <Button
        variant="default"
        className="mt-2 h-8 w-full text-xs"
        onClick={async () => {
          const { added, removed } = getChangedItems();
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
          try {
            if (onUpdate) await onUpdate(added, removed, selectedRows);
            // toast.success(`Updated successfully!`);
            setIsDirty(false);
          } catch (error) {
            toast.error(`Update failed`, {
              description: (error as Error).message ?? "An error occurred",
            });
          }
        }}
      >
        <EditIcon className="mr-1 h-4 w-4" />
        Update {selectedRows.length} row(s)
      </Button>
    </Popover>
  );
}
