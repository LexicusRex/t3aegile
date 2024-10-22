"use client";

import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

import { cn } from "@/lib/utils";

import KanbanTaskBlocksList from "./blocks-list";
import GroupDragOverlay from "./group-drag-overlay";
import {
  getDestinationFromDropPayload,
  getSourceFromDropPayload,
} from "./utils";

interface IKanbanGroup {
  groupId: string;
  // sub_group_id: string;
  taskIds: string[];
  // tasksMap: ITaskMap;
  // groupedTaskIds: TGroupedTasks | TSubGroupedTasks;
  // displayProperties: ITaskDisplayProperties | undefined;
  // sub_group_by: TTaskGroupByOptions | undefined;
  // group_by: TTaskGroupByOptions | undefined;
  // isDragDisabled: boolean;
  // isDropDisabled: boolean;
  // dropErrorMessage: string | undefined;
  // updateTask: ((projectId: string | null, taskId: string, data: Partial<TTask>) => Promise<void>) | undefined;
  // quickActions: TRenderQuickActions;
  // enableQuickTaskCreate?: boolean;
  // quickAddCallback?: (projectId: string | null | undefined, data: TTask) => Promise<TTask | undefined>;
  // loadMoreTasks: (groupId?: string, subGroupId?: string) => void;
  // disableTaskCreation?: boolean;
  // canEditProperties: (projectId: string | undefined) => boolean;
  // groupByVisibilityToggle?: boolean;
  // scrollableContainerRef?: MutableRefObject<HTMLDivElement | null>;
  // handleOnDrop: (source: GroupDropLocation, destination: GroupDropLocation) => Promise<void>;
  // orderBy: TTaskOrderByOptions | undefined;
}

export default function KanbanGroup(props: IKanbanGroup) {
  const {
    groupId,
    taskIds,
    // group_by,
    // orderBy,
    // sub_group_by,
    // tasksMap,
    // displayProperties,
    // groupedTaskIds,
    // isDropDisabled,
    // dropErrorMessage,
    // updateTask,
    // quickActions,
    // canEditProperties,
    // loadMoreTasks,
    // enableQuickTaskCreate,
    // disableTaskCreation,
    // quickAddCallback,
    // scrollableContainerRef,
    // handleOnDrop,
  } = props;

  const columnRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingOverColumn, setIsDraggingOverColumn] = useState(false);
  const [isDraggingFromColumn, setIsDraggingFromColumn] = useState(false);

  // Enable Kanban Columns as Drop Targets
  useEffect(() => {
    const element = columnRef.current;
    invariant(element);
    if (!element) return;

    return combine(
      dropTargetForElements({
        element,
        getData: () => ({
          groupId,
          columnId: groupId,
          type: "COLUMN",
        }),
        onDragEnter: (payload) => {
          setIsDraggingOverColumn(true);
          const source = getSourceFromDropPayload(payload);
          const destination = getDestinationFromDropPayload(payload);
          if (source?.groupId === destination?.groupId) {
            setIsDraggingFromColumn(true);
          }
          // setIsDraggingFromColumn(true);
        },
        onDragLeave: () => {
          setIsDraggingOverColumn(false);
          setIsDraggingFromColumn(false);
        },
        onDragStart: () => {
          setIsDraggingOverColumn(true);
          setIsDraggingFromColumn(true);
        },
        onDrop: (payload) => {
          setIsDraggingOverColumn(false);
          // setIsDraggingFromColumn(false);
          const source = getSourceFromDropPayload(payload);
          const destination = getDestinationFromDropPayload(payload);

          if (!source || !destination) return;

          // if (isDropDisabled) {
          //   dropErrorMessage &&
          //     setToast({
          //       type: TOAST_TYPE.WARNING,
          //       title: "Warning!",
          //       message: dropErrorMessage,
          //     });
          //   return;
          // }

          // handleOnDrop(source, destination);
          console.log("🚀 ~ useEffect ~ source:", source);
          console.log("🚀 ~ useEffect ~ destination:", destination);

          // highlightTaskOnDrop(
          //   getTaskBlockId(
          //     source.id,
          //     destination?.groupId,
          //     destination?.subGroupId,
          //   ),
          //   orderBy !== "sort_order",
          // );
        },
        // getIsSticky: () => true,
      }),
      autoScrollForElements({
        element,
      }),
    );
  }, [
    columnRef,
    groupId,
    setIsDraggingFromColumn,
    // sub_group_id,
    // setIsDraggingOverColumn,
    // orderBy,
    // isDropDisabled,
    // dropErrorMessage,
    // handleOnDrop,
  ]);

  // const canOverlayBeVisible = !isDraggingFromColumn;

  return (
    <div
      id={`${groupId}`}
      className={cn(
        "relative h-full min-h-[120px] transition-all",
        { rounded: isDraggingOverColumn },
        // { "vertical-scrollbar scrollbar-md": !sub_group_by && !shouldOverlayBeVisible }
      )}
      ref={columnRef}
    >
      <GroupDragOverlay
        // dragColumnOrientation={sub_group_by ? "justify-start" : "justify-center"}
        canOverlayBeVisible={!isDraggingFromColumn}
        // isDropDisabled={isDropDisabled}
        // dropErrorMessage={dropErrorMessage}
        // orderBy={orderBy}
        isDraggingOverColumn={isDraggingOverColumn}
      />
      <div className="flex items-center justify-between px-3 py-2">
        <h4 className="text-custom-text-primary mb-2 text-sm font-semibold">
          {groupId}
        </h4>
        <p>+</p>
      </div>
      <KanbanTaskBlocksList
        // sub_group_id={sub_group_id}
        groupId={groupId}
        taskIds={taskIds}
        // tasksMap={tasksMap}
        // displayProperties={displayProperties}
        // updateTask={updateTask}
        // quickActions={quickActions}
        // canEditProperties={canEditProperties}
        // scrollableContainerRef={scrollableContainerRef}
        canDropOverTask={isDraggingFromColumn}
      />
    </div>
  );
}
