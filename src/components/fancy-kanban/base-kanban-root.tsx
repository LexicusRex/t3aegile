"use client";

import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { useParams, usePathname } from "next/navigation";

import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import KanBan from "./default";
//constants

//components
import { getSourceFromDropPayload } from "./utils";

export const BaseKanBanRoot: React.FC = () => {
  // router
  const { workspaceSlug, projectId } = useParams();
  const pathname = usePathname();

  const deleteAreaRef = useRef<HTMLDivElement | null>(null);
  const [isDragOverDelete, setIsDragOverDelete] = useState(false);

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);

  // states
  const [draggedTaskId, setDraggedTaskId] = useState<string | undefined>(
    undefined,
  );
  const [deleteTaskModal, setDeleteTaskModal] = useState(false);

  // Enable Auto Scroll for Main Kanban
  useEffect(() => {
    const element = scrollableContainerRef.current;

    if (!element) return;

    return combine(
      autoScrollForElements({
        element,
      }),
    );
  }, []);

  // Make the Task Delete Box a Drop Target
  useEffect(() => {
    const element = deleteAreaRef.current;

    if (!element) return;

    return combine(
      dropTargetForElements({
        element,
        getData: () => ({
          columnId: "task-trash-box",
          groupId: "task-trash-box",
          type: "DELETE",
        }),
        onDragEnter: () => {
          setIsDragOverDelete(true);
        },
        onDragLeave: () => {
          setIsDragOverDelete(false);
        },
        onDrop: (payload) => {
          setIsDragOverDelete(false);
          const source = getSourceFromDropPayload(payload);

          if (!source) return;

          setDraggedTaskId(source.id);
          setDeleteTaskModal(true);
        },
      }),
    );
  }, [
    // deleteAreaRef?.current,
    setIsDragOverDelete,
    setDraggedTaskId,
    setDeleteTaskModal,
  ]);

  return (
    <div
      className={`horizontal-scrollbar scrollbar-lg relative flex h-fit w-full overflow-x-auto overflow-y-hidden`}
      ref={scrollableContainerRef}
    >
      <div className="relative h-full w-max min-w-full">
        {/* drag and delete component */}
        <div
          className={`fixed left-1/2 top-3 mx-3 flex w-72 -translate-x-1/2 items-center justify-center`}
          ref={deleteAreaRef}
        >
          <div
            className={`flex w-full items-center justify-center rounded border-2 border-red-500/20 px-3 py-5 text-xs font-medium italic text-red-500 ${
              isDragOverDelete ? "bg-red-500 opacity-70 blur-2xl" : ""
            } transition duration-300`}
          >
            Drop here to delete the task.
          </div>
        </div>

        <div className="h-full w-max">
          <KanBan />
        </div>
      </div>
    </div>
  );
};
