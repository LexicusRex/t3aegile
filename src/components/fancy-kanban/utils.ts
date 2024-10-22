import { extractInstruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";

import { GroupByColumnTypes, IGroupByColumn } from "@/lib/types/tasks";

export type TDropTarget = {
  element: Element;
  data: Record<string | symbol, unknown>;
};

export type TDropTargetMiscellaneousData = {
  dropEffect: string;
  isActiveDueToStickiness: boolean;
};

export interface IPragmaticPayloadLocation {
  initial: {
    dropTargets: (TDropTarget & TDropTargetMiscellaneousData)[];
  };
  current: {
    dropTargets: (TDropTarget & TDropTargetMiscellaneousData)[];
  };
  previous: {
    dropTargets: (TDropTarget & TDropTargetMiscellaneousData)[];
  };
}

export interface IPragmaticDropPayload {
  location: IPragmaticPayloadLocation;
  source: TDropTarget;
  self: TDropTarget & TDropTargetMiscellaneousData;
}

export type InstructionType =
  | "reparent"
  | "reorder-above"
  | "reorder-below"
  | "make-child"
  | "instruction-blocked";

export type GroupDropLocation = {
  columnId: string;
  groupId: string;
  subGroupId?: string;
  id: string | undefined;
  canAddTaskBelow?: boolean;
};

/**
 * get Kanban Source data from Pragmatic Payload
 * @param payload
 * @returns
 */
export const getSourceFromDropPayload = (
  payload: IPragmaticDropPayload,
): GroupDropLocation | undefined => {
  const { location, source: sourceTask } = payload;

  const sourceTaskData = sourceTask.data;
  let sourceColumData;

  const sourceDropTargets = location?.initial?.dropTargets ?? [];
  for (const dropTarget of sourceDropTargets) {
    const dropTargetData = dropTarget?.data;

    if (!dropTargetData) continue;

    if (dropTargetData.type === "COLUMN") {
      sourceColumData = dropTargetData;
    }
  }

  if (sourceTaskData?.id === undefined || !sourceColumData?.groupId) return;

  return {
    groupId: sourceColumData.groupId as string,
    subGroupId: sourceColumData.subGroupId as string,
    columnId: sourceColumData.columnId as string,
    id: sourceTaskData.id as string,
  };
};

/**
 * get Destination Source data from Pragmatic Payload
 * @param payload
 * @returns
 */
export const getDestinationFromDropPayload = (
  payload: IPragmaticDropPayload,
): GroupDropLocation | undefined => {
  const { location } = payload;

  let destinationTaskData, destinationColumnData;

  const destDropTargets = location?.current?.dropTargets ?? [];

  for (const dropTarget of destDropTargets) {
    const dropTargetData = dropTarget?.data;

    if (!dropTargetData) continue;

    if (dropTargetData.type === "COLUMN" || dropTargetData.type === "DELETE") {
      destinationColumnData = dropTargetData;
    }

    if (dropTargetData.type === "TASK") {
      destinationTaskData = dropTargetData;
    }
  }

  if (!destinationColumnData?.groupId) return;

  // extract instruction from destination task
  const extractedInstruction = destinationTaskData
    ? extractInstruction(destinationTaskData)?.type
    : "";

  return {
    groupId: destinationColumnData.groupId as string,
    subGroupId: destinationColumnData.subGroupId as string,
    columnId: destinationColumnData.columnId as string,
    id: destinationTaskData?.id as string | undefined,
    canAddTaskBelow: extractedInstruction === "reorder-below",
  };
};

// export const getGroupByColumns = (
//   groupBy: GroupByColumnTypes | null,
//   project: string,
//   module: string,
//   label: string,
//   status: string,
//   assignee: string,
//   includeNone?: boolean,
//   isWorkspaceLevel?: boolean,
// ): IGroupByColumn[] | undefined => {
//   switch (groupBy) {
//     // case "project":
//     //   return console.log("project");
//     // case "cycle":
//     //   return console.log("project");
//     case "module":
//       return [
//         {
//           id: `Modules`,
//           name: `Module`,
//           payload: {},
//           icon: undefined,
//         },
//       ];
//     case "status":
//       return [
//         {
//           id: `Statuses`,
//           name: `status`,
//           payload: {},
//           icon: undefined,
//         },
//       ];
//     // case "state_detail.group":
//     //   return console.log("project");
//     case "priority":
//       return [
//         {
//           id: `Priorities`,
//           name: `priority`,
//           payload: {},
//           icon: undefined,
//         },
//       ];
//     case "label":
//       return [
//         {
//           id: `Labels`,
//           name: `label`,
//           payload: {},
//           icon: undefined,
//         },
//       ];
//     case "assignee":
//       return [
//         {
//           id: `Assignees`,
//           name: `assignee`,
//           payload: {},
//           icon: undefined,
//         },
//       ];
//     // case "created_by":
//     //   return console.log("project");
//     default:
//       if (includeNone)
//         return [
//           {
//             id: `All Tasks`,
//             name: `All Tasks`,
//             payload: {},
//             icon: undefined,
//           },
//         ];
//   }
// };

// const getStatusColumns = (projectStatusStore: unknown): IGroupByColumn[] | undefined => {

// }
