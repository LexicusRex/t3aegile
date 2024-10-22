import type { ReactElement } from "react";

export type TBaseTask = {
  id: string;
  sequenceId: number;
  name: string;
  sortOrder: number;

  statusId: string | null;
  priority: TTaskPriorities | null;
  labelIds: string[];
  assigneeIds: string;
  estimatePoint: string | null;

  subTasksCount: number;
  attachmentCount: number;
  linkCount: number;

  projectId: string | null;
  parentId: string | null;
  moduleIds: string[] | null;
  // typeId: string | null;

  createdAt: string;
  updatedAt: string;
  // start_date: string | null;
  targetDate: string | null;
  completedAt: string | null;
  archivedAt: string | null;

  createdBy: string;
  updatedBy: string;

  isDraft: boolean;
};

export type TTask = TBaseTask & {
  descriptionHtml?: string;
  isSubscribed?: boolean;
  parent?: Partial<TBaseTask>;
  // taskReactions?: TTaskReaction[];
  // taskAttachments?: TTaskAttachment[];
  // taskLink?: TTaskLink[];
  // tempId is used for optimistic updates. It is not a part of the API response.
  tempId?: string;
  // sourceTaskId is used to store the original task id when creating a copy of an task. Used in cloning property values. It is not a part of the API response.
  sourceTaskId?: string;
};

export type TTaskStatuses =
  | "backlog"
  | "todo"
  | "in_progress"
  | "in_review"
  | "done"
  | "cancelled";

export type TTaskPriorities = "urgent" | "high" | "medium" | "low" | "none";

export interface IState {
  readonly id: string;
  color: string;
  default: boolean;
  description: string;
  group: TTaskStatuses;
  name: string;
  projectId: string;
  sequence: number;
  workspaceId: string;
}

export type GroupByColumnTypes =
  | "module"
  | "status"
  | "priority"
  | "assignee"
  | "label";

export interface IGroupByColumn {
  id: string;
  name: string;
  icon: ReactElement | undefined;
  payload: Partial<TTask>;
  isDropDisabled?: boolean;
  dropErrorMessage?: string;
}
