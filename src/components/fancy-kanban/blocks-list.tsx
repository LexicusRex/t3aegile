import KanbanTaskBlock from "./block";

interface TaskBlocksListProps {
  // sub_group_id: string;
  groupId: string;
  taskIds: string[];
  // tasksMap: ITaskMap;
  // displayProperties: ITaskDisplayProperties | undefined;
  // updateTask: ((projectId: string | null, taskId: string, data: Partial<TTask>) => Promise<void>) | undefined;
  // quickActions: TRenderQuickActions;
  // canEditProperties: (projectId: string | undefined) => boolean;
  canDropOverTask: boolean;
  // scrollableContainerRef?: MutableRefObject<HTMLDivElement | null>;
}

export default function KanbanTaskBlocksList(props: TaskBlocksListProps) {
  const {
    // sub_group_id,
    groupId,
    taskIds,
    // tasksMap,
    // displayProperties,
    // updateTask,
    // quickActions,
    // canEditProperties,
    canDropOverTask,
    // scrollableContainerRef,
  } = props;
  return (
    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
      {taskIds && taskIds.length > 0 ? (
        <>
          {taskIds.map((taskId, index) => {
            if (!taskId) return null;

            let draggableId = taskId;
            if (groupId) draggableId = `${draggableId}__${groupId}`;
            // if (sub_group_id) draggableId = `${draggableId}__${sub_group_id}`;

            return (
              <KanbanTaskBlock
                key={draggableId}
                taskId={taskId}
                groupId={groupId}
                // subGroupId={sub_group_id}
                // shouldRenderByDefault={index <= 10}
                // tasksMap={tasksMap}
                // displayProperties={displayProperties}
                // updateTask={updateTask}
                // quickActions={quickActions}
                draggableId={draggableId}
                canDropOverTask={canDropOverTask}
                // canEditProperties={canEditProperties}
                // scrollableContainerRef={scrollableContainerRef}
              />
            );
          })}
        </>
      ) : null}
    </div>
  );
}
