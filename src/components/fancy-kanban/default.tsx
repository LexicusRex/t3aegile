// export interface IKanban {
//   tasksMap: Map<string, TTask>;
// }

import { ContentWrapper } from "@/core/content-wrapper";

import KanbanGroup from "./kanban-group";

export default function KanBan() {
  const lists = [
    {
      groupId: "backlog",
      taskIds: ["1", "2", "3", "4"],
    },
    {
      groupId: "todo",
      taskIds: ["5", "6", "7", "8"],
    },
    {
      groupId: "done",
      taskIds: ["9", "10", "11", "12"],
    },
    {
      groupId: "in-progress",
      taskIds: [
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
      ],
    },
    {
      groupId: "in-review",
      taskIds: ["41", "42", "43", "44"],
    },
    {
      groupId: "cancelled",
      taskIds: ["45", "46", "47", "48"],
    },
  ];

  return (
    <ContentWrapper className={`relative flex-row gap-4 py-4`}>
      {lists &&
        lists.length > 0 &&
        lists.map((list) => {
          return (
            <div
              key={list.groupId}
              className={`group relative flex flex-shrink-0 flex-col ${`w-[350px]`} `}
            >
              <KanbanGroup
                key={list.groupId}
                groupId={list.groupId}
                taskIds={list.taskIds}
              />
            </div>
          );
        })}
    </ContentWrapper>
  );

  return <></>;
}
