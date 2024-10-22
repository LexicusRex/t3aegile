// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BaseKanBanRoot } from "@/components/fancy-kanban/base-kanban-root";

// import KanBan from "@/components/fancy-kanban/default";

// import DndListContext from "@/components/kanban/DndListContext";

export default async function ProjectsTaskPage() {
  return (
    // <main className="flex flex-grow overflow-x-auto border border-red-500">
    //   {/* <DndListContext /> */}
    //   <BaseKanBanRoot />
    //   {/* <ScrollBar orientation="horizontal" /> */}
    // </main>
    <>
      <div className="h-full w-full">
        <div className="relative flex h-full w-full flex-col overflow-hidden">
          <p>Some Stuff</p>
          <div className="relative h-full w-full overflow-auto">
            <p>Some Loader Stuff</p>
            <BaseKanBanRoot />
          </div>

          {/* peek overview */}
          <p>Some Peek stuff</p>
        </div>
      </div>
    </>
  );
}
