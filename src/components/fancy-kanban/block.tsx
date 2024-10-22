"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import { cn } from "@/lib/utils";

import { DropIndicator } from "./drop-indicator";

interface TaskBlockProps {
  taskId: string;
  groupId: string;
  // subGroupId: string;
  draggableId: string;
  // tasksMap: ITaskMap;
  // displayProperties: ITaskDisplayProperties | undefined;
  canDropOverTask: boolean;
  // updateTask: ((projectId: string | null, taskId: string, data: Partial<TTask>) => Promise<void>) | undefined;
  // quickActions: TRenderQuickActions;
  // canEditProperties: (projectId: string | undefined) => boolean;
  // scrollableContainerRef?: MutableRefObject<HTMLDivElement | null>;
  // shouldRenderByDefault?: boolean;
}

export default function KanbanTaskBlock(props: TaskBlockProps) {
  const {
    taskId,
    groupId,
    // subGroupId,
    // tasksMap,
    // displayProperties,
    canDropOverTask,
    // updateTask,
    // quickActions,
    // canEditProperties,
    // scrollableContainerRef,
    // shouldRenderByDefault,
  } = props;

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingOverBlock, setIsDraggingOverBlock] = useState(false);
  const [isCurrentBlockDragging, setIsCurrentBlockDragging] = useState(false);

  // Make Task block both as as Draggable and,
  // as a DropTarget for other tasks being dragged to get the location of drop
  useEffect(() => {
    const element = cardRef.current;

    if (!element) return;

    return combine(
      draggable({
        element,
        dragHandle: element,
        // canDrag: () => isDragAllowed,
        canDrag: () => true,
        getInitialData: () => ({ id: taskId, type: "TASK" }),
        onDragStart: () => {
          setIsCurrentBlockDragging(true);
          // setIsKanbanDragging(true);
        },
        onDrop: () => {
          // setIsKanbanDragging(false);
          setIsCurrentBlockDragging(false);
        },
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => source?.data?.id !== taskId && canDropOverTask,
        getData: () => ({ id: taskId, type: "TASK" }),
        onDragEnter: (args) => {
          setIsDraggingOverBlock(true);
          // console.log("onDragEnter", args);
          if (args.source.data.id !== taskId) {
          }
        },
        onDragLeave: () => {
          setIsDraggingOverBlock(false);
        },
        onDrop: () => {
          setIsDraggingOverBlock(false);
        },
      }),
    );
  }, [
    // cardRef?.current,
    taskId,
    // isDragAllowed,
    canDropOverTask,
    setIsCurrentBlockDragging,
    setIsDraggingOverBlock,
  ]);

  return (
    <>
      <DropIndicator
        isVisible={!isCurrentBlockDragging && isDraggingOverBlock}
      />
      <div
        id={`task-${taskId}`}
        // make Z-index higher at the beginning of drag, to have a task drag image of task block without any overlaps
        className={cn(
          "group/kanban-block relative mb-2",
          {
            "z-[0]": isCurrentBlockDragging,
          },
          "hover:cursor-pointer",
        )}
        // onDragStart={() => {
        //   if (isDragAllowed) setIsCurrentBlockDragging(true);
        //   else
        //     setToast({
        //       type: TOAST_TYPE.WARNING,
        //       title: "Cannot move task",
        //       message: "Drag and drop is disabled for the current grouping",
        //     });
        // }}
        ref={cardRef}
      >
        <div
          id={taskId}
          // href={`/${workspaceSlug}/projects/${task.project_id}/${task.archived_at ? "archives/" : ""}tasks/${
          //   task.id
          // }`}
          className={cn(
            "block w-full rounded border-[1px] border-border bg-white text-sm outline-[0.5px] outline-transparent transition-all hover:border-accent-foreground/80 dark:bg-[#17181b]",
            // { "hover:cursor-pointer": isDragAllowed },
            // { "border border-custom-primary-70 hover:border-custom-primary-70": getIsTaskPeeked(task.id) },
            { "z-[1] bg-white dark:bg-[#17181b]": isCurrentBlockDragging },
            "p-3",
          )}
          // onClick={() => handleTaskPeekOverview(task)}
          // disabled={!!task?.tempId}
        >
          {/* <KanbanTaskDetailsBlock
              cardRef={cardRef}
              task={task}
              displayProperties={displayProperties}
              updateTask={updateTask}
              quickActions={quickActions}
              isReadOnly={!canEditTaskProperties}
            /> */}
          {taskId}. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Esse deleniti facere autem mollitia voluptate, nemo molestias ratione
          atque placeat! Dolorum vel quibusdam id esse possimus dolor placeat
          quidem, vitae ea.
        </div>
      </div>
    </>
  );
}

KanbanTaskBlock.displayName = "KanbanTaskBlock";
